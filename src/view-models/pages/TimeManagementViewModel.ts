import { autorun, makeAutoObservable } from "mobx";
import { uniqBy, prop } from "ramda";
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
import { ConflictsInfoVM } from "../ConflictsInfoVM";
import { pupilRepository } from "../../models/pupil/PupilRepository";
import { LessonEntity } from "../../models/lesson/LessonEntity";
import { teacherRepository } from "../../models/teacher/TeacherRepository";
import { scheduleContextStore } from "../../models/schedule-context-store/ScheduleContextStore";
import {ConfirmAssistanceVM} from "../modals/ConfirmAssistanceVM";

type Params = {
  canChangeTeacher: boolean;
};

export class TimeManagementVM {
  get confirmAssistance(): ConfirmAssistanceVM | null {
    return this._confirmAssistance;
  }
  get isSynchronized(): boolean {
    return this._isSynchronized;
  }
  private _isLoading = true;
  private _isSynchronized = true;
  private _schedule: ScheduleEntity;
  private _selectedDay = 0;
  private _dayOptions = [
    { value: 0, text: "??????????????????????" },
    { value: 1, text: "??????????????" },
    { value: 2, text: "??????????" },
    { value: 3, text: "??????????????" },
    { value: 4, text: "??????????????" },
    { value: 5, text: "??????????????" },
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
  private readonly _conflictsInfo: ConflictsInfoVM;

  private _confirmExtraEmployment: ConfirmExtraEmploymentVM | null = null;
  private _confirmLesson: ConfirmLessonVM | null = null;
  private _confirmAction: ConfirmActionVM | null = null;
  private _confirmSpanChange: ConfirmSpanChangeVM | null = null;
  private _confirmAssistance: ConfirmAssistanceVM | null = null;

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

  handleDayChange(day: number) {
    this._selectedDay = day;
  }

  get dayOptions() {
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

  get conflictsInfo() {
    return this._conflictsInfo;
  }

  get isLoading() {
    return this._isLoading;
  }

  private _getPersonsInLesson(lesson: LessonEntity) {
    const pupils = pupilRepository.entities;
    const groups = groupRepository.entities;
    const isPupil = Object.values(pupils).some(
      (pupil) => pupil.lessonTakerId === lesson.lessonTaker
    );
    const lessonTakersIds = isPupil
      ? [
          Object.values(pupils).find(
            (pupil) => pupil.lessonTakerId === lesson.lessonTaker
          )?.id ?? 0,
        ]
      : Object.values(groups).find(
          (group) => group.lessonTakerId === lesson.lessonTaker
        )?.pupils ?? [];
    return [lesson.teacher, ...lessonTakersIds];
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
    const teachers = teacherRepository.entities;

    this._teacherTimeline.spans = [
      ...relevantLessons.map((lesson) => {
        const takerDescription = this._getLessonTakerDescription(lesson);
        return {
          id: lesson.id,
          start: lesson.start,
          end: lesson.end,
          type: "lesson" as const,
          text: subjects[lesson.subject]?.name,
          longText: `${subjects[lesson.subject]?.name} (?????????????????????????? ${
            currentTeacher.name
          }, ${takerDescription})`,
          persons: this._getPersonsInLesson(lesson),
          subItem: lesson.assistance === undefined
              ? undefined
              : {
                start: lesson.assistance.start,
                end: lesson.assistance.end,
                text: `???????????????????????????? ${teachers[lesson.assistance.teacher].name}`,
              }
        };
      }),
      ...relevantExtraEmployments.map((employment) => ({
        id: employment.id,
        start: employment.start,
        end: employment.end,
        type: "extra" as const,
        text: employment.description,
        longText: `?????????????????? "${employment.description}" ?????????????????????????? ${currentTeacher.name}`,
        persons: [employment.person],
      })),
    ];
  }

  private _getLessonTakerDescription(lesson: LessonEntity) {
    const isLessonForGroup = Object.values(groupRepository.entities).some(
      (group) => group.lessonTakerId === lesson.lessonTaker
    );
    return isLessonForGroup
      ? `????????????: "${
          Object.values(groupRepository.entities).find(
            (group) => group.lessonTakerId === lesson.lessonTaker
          )?.name
        }"`
      : `????????????????: ${
          Object.values(pupilRepository.entities).find(
            (pupil) => pupil.lessonTakerId === lesson.lessonTaker
          )?.name
        }`;
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
    const teachers = teacherRepository.entities;
    this._takerTimeline.spans = [
      ...[...relevantLessons, ...groupLessonsForPupil].map((lesson) => {
        const teacherName = teacherRepository.entities[lesson.teacher].name;
        const takerDescription = this._getLessonTakerDescription(lesson);
        return {
          id: lesson.id,
          start: lesson.start,
          end: lesson.end,
          type: "lesson" as const,
          text: subjects[lesson.subject]?.name,
          longText: `${
            subjects[lesson.subject]?.name
          } (??????????????????????????: ${teacherName}, ${takerDescription})`,
          persons: this._getPersonsInLesson(lesson),
          subItem: lesson.assistance === undefined
              ? undefined
              : {
                start: lesson.assistance.start,
                end: lesson.assistance.end,
                text: `???????????????????????????? ${teachers[lesson.assistance.teacher].name}`,
              }
        };
      }),
      ...relevantExtraEmployments.map((employment) => ({
        id: employment.id,
        start: employment.start,
        end: employment.end,
        type: "extra" as const,
        text: employment.description,
        longText: `?????????????????? "${employment.description}" ?????????????????? ${currentTaker.name}`,
        persons: [employment.person],
      })),
    ];
  }

  async setCommonTimelineSpans() {
    this._commonTimeline.spans = uniqBy(prop("id"), [
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
    const info = this._getSpanInfo(id, type);
    return new Promise<boolean>((res) => {
      this._confirmSpanChange = new ConfirmSpanChangeVM({
        text: `?????????????????? ???????????????????? ${
          type === "lesson" ? "??????????" : "??????????????????"
        }`,
        info,
        start,
        end,
        onSubmit: async ({ start, end }) => {
          this._isSynchronized = false;
          this._confirmSpanChange = null;
          if (type === "lesson") {
            await lessonRepository.updateEntity(id, { start, end });
          } else {
            await extraEmploymentRepository.updateEntity(id, { start, end });
          }
          res(true);
          this._isSynchronized = true;
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
    const lessons = lessonRepository.entities;
    const teachers = teacherRepository.entities;
    const pupils = pupilRepository.entities;
    const subjects = subjectRepository.entities;
    if (type === "lesson") {
      const lesson = lessons[id];
      const teacher = teachers[lesson.teacher].name;
      const subject = subjects[lesson.subject].name;
      const lessonTaker = this._getLessonTakerDescription(lesson);
      spanDesc = `?????????\n??????????????????????????: ${teacher}\n??????????????: ${subject}\n${lessonTaker}`;
    } else {
      const employment = await extraEmploymentRepository.getEntityById(id);
      const owner =
        pupils[employment?.person ?? 0] === undefined ? "teacher" : "pupil";
      const ownerName =
        owner === "teacher"
          ? teachers[employment?.person ?? 0].name
          : pupils[employment?.person ?? 0].name;
      spanDesc = `?????????????????? "${employment?.description}" ${
        owner === "teacher" ? "??????????????????????????" : "??????????????????"
      } ${ownerName}?`;
    }
    this._confirmAction = new ConfirmActionVM({
      title: `???????????????? ${type === "lesson" ? "??????????" : "??????????????????"}`,
      text: `???? ?????????????????????????? ???????????? ?????????????? ${spanDesc}`,
      onClose: () => {
        this._confirmAction = null;
      },
      onConfirm: async () => {
        this._isSynchronized = false;
        this._confirmAction = null;
        if (type === "lesson") {
          await lessonRepository.removeEntity(id);
        } else {
          await extraEmploymentRepository.removeEntity(id);
        }
        this._isSynchronized = true;
      },
    });
  }

  private async _onTimelineExtraEmploymentSpanDrawingEnd({
    start,
    end,
    personType,
  }: {
    start: number;
    end: number;
    personType: "teacher" | "pupil";
  }) {
    return new Promise<void>((res) => {
      this._confirmExtraEmployment = new ConfirmExtraEmploymentVM({
        start,
        end,
        person:
          personType === "teacher"
            ? this._teacherField.value?.name ?? ""
            : this._pupilField.value?.name ?? "", // TODO: ???????????????????? ???????????? ?? undefined
        weekDay: WEEK_DAY_NAMES[this._selectedDay],
        onConfirm: async ({ start, end, description }) => {
          this._isSynchronized = false;
          this._confirmExtraEmployment = null;
          try {
            const personId =
              personType === "teacher"
                ? this._teacherField.value?.id
                : this._pupilField.value?.id;
            if (personId === undefined) {
              throw new Error("???? ???????????? ??????????????????????????/????????????????");
            }
            await extraEmploymentRepository.addEntity({
              schedule: this._schedule.id,
              person: personId,
              weekDay: this._selectedDay,
              start,
              end,
              description,
            });
            res();
          } catch (e) {
            addError(getErrorMessage(e));
          }
          this._isSynchronized = true;
        },
        onClose: () => {
          res();
          this._confirmExtraEmployment = null;
        },
      });
    });
  }

  private async _onTimelineLessonDrawingEnd({
    start,
    end,
  }: {
    start: number;
    end: number;
  }) {
    return new Promise<void>((res) => {
      this._confirmLesson = new ConfirmLessonVM({
        start,
        end,
        teacher: this._teacherField.value?.name ?? "",
        taker:
          this._lessonTakerType === "pupil"
            ? `?????????????????? ${this._pupilField.value?.name}`
            : `???????????? "${this._groupField.value?.name}"`,
        weekDay: WEEK_DAY_NAMES[this._selectedDay],
        filterSubjects: (subject: SubjectEntity) =>
          this._getAvailableSubjectsForAssign().includes(subject.id),
        onSubmit: async ({ start, end, subject }) => {
          this._isSynchronized = false;
          this._confirmLesson = null;
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
          } catch (e) {
            addError(getErrorMessage(e));
          }
          this._isSynchronized = true;
          res();
        },
        onClose: () => {
          res();
          this._confirmLesson = null;
        },
      });
    });
  }

  private async _onLessonAddAssistanceClick(lessonId: number) {
    const lesson = await lessonRepository.getEntityById(lessonId);
    if (lesson === null) {
      throw new Error("???? ???????????? ????????");
    }
    const mainTeacher = teacherRepository.entities[lesson.teacher];
    const taker = this._getLessonTakerDescription(lesson);
    const subject = subjectRepository.entities[lesson.subject];
    const weekDay = WEEK_DAY_NAMES[lesson.weekDay];
    this._confirmAssistance = new ConfirmAssistanceVM({
      lessonStart: lesson.start,
      lessonEnd: lesson.end,
      mainTeacher: mainTeacher.name,
      taker,
      subject: subject.name,
      weekDay,
      onClose: () => {
        this._confirmAssistance = null;
      },
      onSubmit: async ({ start, end, teacher }) => {
        await lessonRepository.updateEntity(lessonId, {
          assistance: {
            start,
            end,
            teacher,
          }
        });
        this._confirmAssistance = null;
      }
    })
  }

  private _onLessonAssistanceCrossClick(idLesson: number) {
    this._confirmAction = new ConfirmActionVM({
      title: '???????????????? ??????????????????????????????/????????????????????????',
      text: '?????????????? ??????????????????????????????/???????????????????????? ?? ?????????????? ???????????',
      onConfirm: async () => {
        await lessonRepository.deleteAssistance(idLesson);
        this._confirmAction = null;
      },
      onClose: () => {
        this._confirmAction = null;
      }
    })
  }

  private _getSpanInfo(id: number, spanType: "lesson" | "extra") {
    if (spanType === "lesson") {
      const lesson = lessonRepository.entities[id];
      const takerDescription = this._getLessonTakerDescription(lesson);
      const teacher = teacherRepository.entities[lesson.teacher].name;
      const subject = subjectRepository.entities[lesson.subject].name;
      return `??????????????: ${subject}\n??????????????????????????: ${teacher}\n${takerDescription}`;
    } else {
      const employment = extraEmploymentRepository.entities[id];
      const isPupil = pupilRepository.entities[employment.person] !== undefined;
      const personName = isPupil
        ? pupilRepository.entities[employment.person].name
        : teacherRepository.entities[employment.person].name;
      return `${personName}, "${employment.description}"`;
    }
  }

  constructor(params: Params) {
    if (scheduleContextStore.currentSchedule === null) {
      throw new Error("???? ?????????????? ?????????????? ????????????????????");
    }
    this._schedule = scheduleContextStore.currentSchedule;
    this._canChangeTeacher = params.canChangeTeacher;
    this._teacherField = new LinkFieldVM<TeacherEntity>(
      { label: "??????????????????????????", isDisabled: !params.canChangeTeacher },
      { entityModel: teacherRepository, shouldSetInitialValue: true }
    );
    this._pupilField = new LinkFieldVM<PupilEntity>(
      { label: "????????????????" },
      {
        entityModel: pupilRepository,
        entitiesFilter: (pupil) => {
          return this._schedule.loads.some(
            (load) =>
              load.teacher === this._teacherField.value?.id &&
              load.pupil === pupil.id
          );
        },
        shouldSetInitialValue: true,
      }
    );
    this._groupField = new LinkFieldVM<GroupEntity>(
      { label: "????????????" },
      {
        entityModel: groupRepository,
        entitiesFilter: (group) => {
          return group.pupils.every((pupil) =>
            this._schedule.loads.some(
              (load) =>
                load.teacher === this._teacherField.value?.id &&
                load.pupil === pupil
            )
          );
        },
        shouldSetInitialValue: true,
      }
    );
    this._teacherTimeline = new TimelineVM({
      spans: [],
      onSpanDrawingEnd: ({ start, end }) => {
        return this._onTimelineExtraEmploymentSpanDrawingEnd({
          start,
          end,
          personType: "teacher",
        });
      },
      onSpanChange: (...args) => {
        return this._onTimelineSpanChange(...args);
      },
      onSpanCrossClick: (...args) => this._onTimelineCrossClick(...args),
      onAddAssistanceClick: (...args) => this._onLessonAddAssistanceClick(...args),
      onAssistanceCrossClick: (...args) => this._onLessonAssistanceCrossClick(...args),
    });
    this._takerTimeline = new TimelineVM({
      spans: [],
      onSpanDrawingEnd: ({ start, end }) => {
        return this._onTimelineExtraEmploymentSpanDrawingEnd({
          start,
          end,
          personType: "pupil",
        });
      },
      onSpanChange: (...args) => {
        return this._onTimelineSpanChange(...args);
      },
      onSpanCrossClick: (...args) => this._onTimelineCrossClick(...args), //fix text
      onAddAssistanceClick: (...args) => this._onLessonAddAssistanceClick(...args),
      onAssistanceCrossClick: (...args) => this._onLessonAssistanceCrossClick(...args),
    });
    this._commonTimeline = new TimelineVM({
      spans: [],
      onSpanDrawingEnd: ({ start, end }) => {
        return this._onTimelineLessonDrawingEnd({ start, end });
      },
      onSpanChange: (...args) => {
        return this._onTimelineSpanChange(...args);
      },
      onSpanCrossClick: (...args) => this._onTimelineCrossClick(...args), // fix text?
      onAddAssistanceClick: (...args) => this._onLessonAddAssistanceClick(...args),
      onAssistanceCrossClick: (...args) => this._onLessonAssistanceCrossClick(...args),
    });
    this._loadsInfo = new LoadsInfoVM(this._schedule);
    this._conflictsInfo = new ConflictsInfoVM(this._schedule, (weekDay) => {
      this._selectedDay = weekDay;
    });
    makeAutoObservable(this);
    autorun(() => {
      if (scheduleContextStore.currentSchedule === null) {
        throw new Error("???? ?????????????? ?????????????? ????????????????????");
      }
      this._schedule = scheduleContextStore.currentSchedule;
    });
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
        this._loadsInfo.title = `???????????????? ?????????????????????????? ${currentTeacher.name}`;
      } else {
        this._loadsInfo.title = "???????? ????????????????";
      }
    });
    autorun(() => {
      const currentTeacher = this._teacherField.value;
      if (currentTeacher !== null) {
        this._conflictsInfo.teacherId = currentTeacher.id;
      }
    });
    autorun(() => {
      if (
        this._isLoading &&
        !this._loadsInfo.isLoading &&
        !this._conflictsInfo.isLoading
      ) {
        this._isLoading = false;
      }
    });
  }
}
