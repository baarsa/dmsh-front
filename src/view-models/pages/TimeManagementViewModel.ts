import {
  autorun,
  makeAutoObservable,
} from "mobx";
import { uniqBy, prop } from 'ramda';
import { GroupEntity } from "../../models/group/GroupEntity";
import { lessonRepository } from "../../models/lesson/LessonRepository";
import { PupilEntity } from "../../models/pupil/PupilEntity";
import { TeacherEntity } from "../../models/teacher/TeacherEntity";
import { LinkFieldVM } from "../fields/LinkField";
import { SpanType, TimelineVM } from "../TimelineVM";
import { ScheduleEntity } from "../../models/schedule/ScheduleEntity";
import { ConfirmExtraEmploymentVM } from "../modals/ConfirmExtraEmploymentVM";
import { extraEmploymentRepository } from "../../models/extra-employment/ExtraEmploymentRepository";
import { ConfirmLessonVM } from "../modals/ConfirmLessonVM";
import { SubjectEntity } from "../../models/subject/SubjectEntity";
import { groupRepository } from "../../models/group/GroupRepository";
import { subjectRepository } from "../../models/subject/SubjectRepository";
import { addError } from "../../notifications";
import { getErrorMessage } from "../../utils";
import { ConfirmActionVM } from "../modals/ConfirmActionVM";
import { ConfirmSpanChangeVM } from "../modals/ConfirmSpanChangeVM";
import { WEEK_DAY_NAMES } from "../../const";
import { LoadsInfoVM } from "../LoadsInfoVM";

type Params = {
  schedule: ScheduleEntity;
  canChangeTeacher: boolean;
  teacherField: LinkFieldVM<TeacherEntity>;
  pupilField: LinkFieldVM<PupilEntity>;
  groupField: LinkFieldVM<GroupEntity>;
};

export class TimeManagementVM {
  private _schedule: ScheduleEntity;
  private _selectedDay = 0;
  private _dayOptions = [
    { value: 0, text: "Понедельник" },
    { value: 1, text: "Вторник" },
    { value: 2, text: "Среда" },
    { value: 3, text: "Четверг" },
    { value: 4, text: "Пятница" },
    { value: 5, text: "Суббота" },
  ];
  private readonly _canChangeTeacher: boolean;
  private _lessonTakerType: "pupil" | "group" = "pupil";
  private readonly _teacherField: LinkFieldVM<TeacherEntity>;
  private readonly _pupilField: LinkFieldVM<PupilEntity>;
  private readonly _groupField: LinkFieldVM<GroupEntity>;
  private readonly _teacherTimeline: TimelineVM;
  private readonly _takerTimeline: TimelineVM;
  private readonly _commonTimeline: TimelineVM;

  private readonly _loadsInfo: LoadsInfoVM;

  //modal
  private _confirmExtraEmployment: ConfirmExtraEmploymentVM | null = null;
  private _confirmLesson: ConfirmLessonVM | null = null;
  private _confirmAction: ConfirmActionVM | null = null;
  private _confirmSpanChange: ConfirmSpanChangeVM | null = null;

  private _getAvailableSubjectsForAssign() {
    const currentTeacher = this._teacherField.value;
    if (currentTeacher === null) {
      throw new Error("No teacher selected");
    }
    const loads = this._schedule.loads.filter(
      (load) => load.teacher === currentTeacher.id
    );
    if (this._lessonTakerType === "pupil") {
      const currentPupil = this._pupilField.value;
      if (currentPupil === null) {
        throw new Error("No pupil selected");
      }
      return loads
        .filter((load) => load.pupil === currentPupil.id)
        .map((load) => load.subject);
    } else {
      const currentGroup = this._groupField.value;
      if (currentGroup === null) {
        throw new Error("No group selected");
      }
      const pupilsInGroup = currentGroup.pupils;
      const subjectsForPupils = pupilsInGroup.map((pupil) =>
        loads.reduce(
          (acc: number[], load) =>
            load.pupil === pupil ? [...acc, load.subject] : acc,
          []
        )
      );
      const subjectSet = new Set(subjectsForPupils[0]);
      for (let i = 1; i < subjectsForPupils.length; i++) {
        subjectSet.forEach((subject) => {
          if (!subjectsForPupils[i].includes(subject)) {
            subjectSet.delete(subject);
          }
        });
      }
      return Array.from(subjectSet); // TODO: optimize/simplify
    }
  }

  // view handlers
  handleDayChange(day: number) {
    this._selectedDay = day;
  }

  // getters for view
  get dayOptions() {
    // try to make it real getters and hide properties
    return this._dayOptions;
  }
  get selectedDay() {
    return this._selectedDay;
  }
  get teacherField() {
    return this._teacherField;
  }
  get pupilField() {
    return this._pupilField;
  }
  get groupField() {
    return this._groupField;
  }
  get lessonTakerType() {
    return this._lessonTakerType;
  }
  set lessonTakerType(value: "pupil" | "group") {
    //extract type
    this._lessonTakerType = value;
  }

  get teacherTimeline() {
    return this._teacherTimeline;
  }

  get takerTimeline() {
    return this._takerTimeline;
  }

  get commonTimeline() {
    return this._commonTimeline;
  }

  get confirmExtraEmployment() {
    return this._confirmExtraEmployment;
  }

  get confirmLesson() {
    return this._confirmLesson;
  }

  get confirmAction() {
    return this._confirmAction;
  }

  get confirmSpanChange() {
    return this._confirmSpanChange;
  }

  get loadsInfo() {
    return this._loadsInfo;
  }

  async setTeacherTimelineSpans() {
    const currentTeacher = this._teacherField.value;
    if (currentTeacher === null) {
      return;
    }

    const relevantLessons = this._schedule.lessons.filter(
      (lesson) =>
        lesson.teacher === currentTeacher.id &&
        lesson.weekDay === this.selectedDay
    );

    if (!lessonRepository.isSynchronized) {
      return;
    }

    const relevantExtraEmployments = this._schedule.extraEmployments.filter(
      (employment) =>
        employment.person === currentTeacher.id &&
        employment.weekDay === this.selectedDay
    );
    if (!extraEmploymentRepository.isSynchronized) {
      // proxy issynced to schedule entity
      return;
    }
    const subjects = subjectRepository.entities;
    this._teacherTimeline.spans = [
      ...relevantLessons.map((lesson) => ({
        id: lesson.id,
        start: lesson.start,
        end: lesson.end,
        type: "lesson" as const,
        text: subjects[lesson.subject]?.name,
      })),
      ...relevantExtraEmployments.map((employment) => ({
        id: employment.id,
        start: employment.start,
        end: employment.end,
        type: "extra" as const,
        text: employment.description,
      })),
    ];
  }

  async setTakerTimelineSpans() {
    const currentTaker =
      this._lessonTakerType === "pupil"
        ? this._pupilField.value
        : this._groupField.value;
    if (currentTaker === null) {
      return;
    }

    const relevantLessons = this._schedule.lessons.filter(
      (lesson) =>
        lesson.lessonTaker === currentTaker.lessonTakerId &&
        lesson.weekDay === this.selectedDay
    );
    const groupLessonsForPupil =
      this._lessonTakerType === "pupil"
        ? // get all groups for pupil; get all lessons for every group
          this._schedule.lessons.filter(
            (lesson) =>
              lesson.weekDay === this._selectedDay &&
              groupRepository
                .getByPupil(currentTaker.id)
                .some((group) => lesson.lessonTaker === group.lessonTakerId)
          )
        : [];
    if (!lessonRepository.isSynchronized) {
      // do we still need it?
      return;
    }

    const relevantExtraEmployments =
      this._lessonTakerType === "pupil"
        ? this._schedule.extraEmployments.filter(
            (employment) =>
              employment.person === currentTaker.id &&
              employment.weekDay === this.selectedDay
          )
        : [];
    if (!extraEmploymentRepository.isSynchronized) {
      // proxy issynced to schedule entity
      return;
    }
    const subjects = subjectRepository.entities;
    this._takerTimeline.spans = [
      ...[...relevantLessons, ...groupLessonsForPupil].map((lesson) => ({
        id: lesson.id,
        start: lesson.start,
        end: lesson.end,
        type: "lesson" as const,
        text: subjects[lesson.subject]?.name,
      })),
      ...relevantExtraEmployments.map((employment) => ({
        id: employment.id,
        start: employment.start,
        end: employment.end,
        type: "extra" as const,
        text: employment.description,
      })),
    ];
  }

  async setCommonTimelineSpans() {
    this._commonTimeline.spans = uniqBy(prop('id'), [
      ...this._teacherTimeline.spans,
      ...this._takerTimeline.spans,
    ]);
  }

  private _onTimelineSpanChange(
    id: number,
    type: SpanType,
    start: number,
    end: number
  ) {
    return new Promise<boolean>((res) => {
      this._confirmSpanChange = new ConfirmSpanChangeVM({
        text: `Изменение параметров ${
          type === "lesson" ? "урока" : "занятости"
        }`, // TODO: добавить подробности
        start,
        end,
        onSubmit: async ({ start, end }) => {
          if (type === "lesson") {
            await lessonRepository.updateEntity(id, { start, end });
          } else {
            await extraEmploymentRepository.updateEntity(id, { start, end });
          }
          this._confirmSpanChange = null;
          res(true);
        },
        onClose: () => {
          this._confirmSpanChange = null;
          res(false);
        },
      });
    });
  }

  private async _onTimelineCrossClick(id: number, type: SpanType) {
    let spanDesc = "";
    if (type === "lesson") {
      spanDesc = "урок"; // TODO: добавить название предмета и принимателя урока
    } else {
      const employment = await extraEmploymentRepository.getEntityById(id);
      spanDesc = `занятость "${employment?.description}"`;
    }
    const teacherName = this._teacherField.value?.name ?? "";
    this._confirmAction = new ConfirmActionVM({
      text: `Вы действительно хотите удалить ${spanDesc} преподавателя ${teacherName}?`,
      onClose: () => {
        this._confirmAction = null;
      },
      onConfirm: async () => {
        if (type === "lesson") {
          await lessonRepository.removeEntity(id);
        } else {
          await extraEmploymentRepository.removeEntity(id);
        }
        this._confirmAction = null;
      },
    });
  }

  constructor(params: Params) {
    this._schedule = params.schedule;
    this._canChangeTeacher = params.canChangeTeacher;
    this._teacherField = params.teacherField;
    this._pupilField = params.pupilField;
    this._groupField = params.groupField;
    this._teacherTimeline = new TimelineVM({
      spans: [],
      onSpanDrawingEnd: ({ start, end }) => {
        this._confirmExtraEmployment = new ConfirmExtraEmploymentVM({
          start,
          end,
          person: this._teacherField.value?.name ?? "", // TODO: обработать случай с undefined
          weekDay: WEEK_DAY_NAMES[this._selectedDay],
          onConfirm: async ({ start, end, description }) => {
            try {
              const currentTeacher = this._teacherField.value;
              if (currentTeacher === null) {
                throw new Error("No teacher found"); // TODO: handle errors
              }
              await extraEmploymentRepository.addEntity({
                schedule: this._schedule.id,
                person: currentTeacher.id,
                weekDay: this._selectedDay,
                start,
                end,
                description,
              });
              this._confirmExtraEmployment = null;
            } catch (e) {
              addError(getErrorMessage(e));
            }
          },
          onClose: () => {
            this._confirmExtraEmployment = null;
          },
        });
      },
      onSpanChange: (...args) => this._onTimelineSpanChange(...args),
      onSpanCrossClick: (...args) => this._onTimelineCrossClick(...args),
    });
    this._takerTimeline = new TimelineVM({
      spans: [],
      onSpanDrawingEnd: ({ start, end }) => {
        this._confirmExtraEmployment = new ConfirmExtraEmploymentVM({
          start,
          end,
          person: this._pupilField.value?.name ?? "", // TODO: обработать случай с undefined
          weekDay: WEEK_DAY_NAMES[this._selectedDay],
          onConfirm: async ({ start, end, description }) => {
            try {
              const currentPupil = this._pupilField.value;
              if (currentPupil === null) {
                throw new Error("No pupil found"); // TODO: handle errors
              }
              await extraEmploymentRepository.addEntity({
                schedule: this._schedule.id,
                person: currentPupil.id,
                weekDay: this._selectedDay,
                start,
                end,
                description,
              });
              this._confirmExtraEmployment = null;
            } catch (e) {
              addError(getErrorMessage(e));
            }
          },
          onClose: () => {
            this._confirmExtraEmployment = null;
          },
        });
      },
      onSpanChange: (...args) => this._onTimelineSpanChange(...args),
      onSpanCrossClick: (...args) => this._onTimelineCrossClick(...args), //fix text
    });
    this._commonTimeline = new TimelineVM({
      spans: [],
      onSpanDrawingEnd: ({ start, end }) => {
        this._confirmLesson = new ConfirmLessonVM({
          start,
          end,
          teacher: this._teacherField.value?.name ?? "",
          taker:
            this._lessonTakerType === "pupil"
              ? this._pupilField.value?.name ?? ""
              : this._groupField.value?.name ?? "",
          weekDay: WEEK_DAY_NAMES[this._selectedDay],
          filterSubjects: (subject: SubjectEntity) =>
            this._getAvailableSubjectsForAssign().includes(subject.id),
          onSubmit: async ({ start, end, subject }) => {
            try {
              const currentTaker =
                this._lessonTakerType === "pupil"
                  ? this._pupilField.value
                  : this._groupField.value;
              const currentTeacher = this._teacherField.value;
              if (currentTaker === null || currentTeacher === null) {
                throw new Error("No pupil or teacher found"); // TODO: handle errors
              }
              await lessonRepository.addEntity({
                schedule: this._schedule.id,
                lessonTaker: currentTaker.lessonTakerId,
                teacher: currentTeacher.id,
                weekDay: this._selectedDay,
                start,
                end,
                subject,
              });
              this._confirmLesson = null;
            } catch (e) {
              addError(getErrorMessage(e));
            }
          },
          onClose: () => {
            this._confirmLesson = null;
          },
        });
      },
      onSpanChange: (...args) => this._onTimelineSpanChange(...args),
      onSpanCrossClick: (...args) => this._onTimelineCrossClick(...args), // fix text?
    });
    const currentTeacher = this.teacherField.value;
    if (currentTeacher === null) {
      throw new Error();
    }
    this._loadsInfo = new LoadsInfoVM(this._schedule, currentTeacher.id);
    makeAutoObservable(this);
    autorun(() => this.setTeacherTimelineSpans());
    autorun(() => this.setTakerTimelineSpans());
    autorun(() => this.setCommonTimelineSpans());
    autorun(() => {
      this._takerTimeline.canDrawSpan = this._lessonTakerType === "pupil";
    });
    autorun(() => {
      const currentTeacher = this._teacherField.value;
      if (currentTeacher !== null) {
        this._loadsInfo.teacherId = currentTeacher.id;
      }
    });
    autorun(() => {
      if (this._canChangeTeacher) {
        const currentTeacher = this._teacherField.value;
        if (currentTeacher === null) {
          return;
        }
        this._loadsInfo.title = `Нагрузка преподавателя ${currentTeacher.name}`;
      } else {
        this._loadsInfo.title = "Ваша нагрузка";
      }
    });
  }
}
