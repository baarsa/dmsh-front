import {autorun, getObserverTree, makeAutoObservable, observable, reaction, trace} from "mobx";
import { GroupEntity } from "../../models/group/GroupEntity";
import { lessonRepository } from "../../models/lesson/LessonRepository";
import { PupilEntity } from "../../models/pupil/PupilEntity";
import { TeacherEntity } from "../../models/teacher/TeacherEntity";
import { LinkFieldVM } from "../fields/LinkField";
import {TimelineVM} from "../TimelineVM";
import {ScheduleEntity} from "../../models/schedule/ScheduleEntity";
import { ConfirmExtraEmploymentVM } from "../modals/ConfirmExtraEmploymentVM";
import {extraEmploymentRepository} from "../../models/extra-employment/ExtraEmploymentRepository";
import {ConfirmLessonVM} from "../modals/ConfirmLessonVM";

type Params = {
  schedule: ScheduleEntity;
  canChangeTeacher: boolean;
  teacherField: LinkFieldVM<TeacherEntity>;
  pupilField: LinkFieldVM<PupilEntity>;
  groupField: LinkFieldVM<GroupEntity>;
};

export class TimeManagementVM {
  private _schedule: ScheduleEntity;
  private _selectedDay: number = 0;
  private _dayOptions = [
    { value: 0, text: "Понедельник" },
    { value: 1, text: "Вторник" }
  ];
  private _canChangeTeacher: boolean;
  private _teacherField: LinkFieldVM<TeacherEntity>;
  private _lessonTakerType: "pupil" | "group" = "pupil";
  private _pupilField: LinkFieldVM<PupilEntity>;
  private _groupField: LinkFieldVM<GroupEntity>;
  private readonly _teacherTimeline: TimelineVM;
  private readonly _takerTimeline: TimelineVM;
  private readonly _commonTimeline: TimelineVM;

  //modal
  private _confirmExtraEmployment: ConfirmExtraEmploymentVM | null = null;
  private _confirmLesson: ConfirmLessonVM | null = null;

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
  set lessonTakerType(value: "pupil" | "group") { //extract type
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

  //effects
  // set teacher timeline spans
  async setTeacherTimelineSpans() {
    const currentTeacher = this._teacherField.value;
    if (currentTeacher === null) {
      return;
    }

    const relevantLessons = this._schedule.lessons
        .filter(lesson => lesson.teacher === currentTeacher.id && lesson.weekDay === this.selectedDay);

    if (!lessonRepository.isSynchronized) {
      return;
    }

    const relevantExtraEmployments = this._schedule.extraEmployments
        .filter(employment => employment.person === currentTeacher.id && employment.weekDay === this.selectedDay);
    if (!extraEmploymentRepository.isSynchronized) { // proxy issynced to schedule entity
      return;
    }
    this._teacherTimeline.spans = [...relevantLessons.map(lesson => ({
      start: lesson.start,
      end: lesson.end,
      text: String(lesson.subject), // todo map to subject name
    })),
        ...relevantExtraEmployments.map(employment => ({
          start: employment.start,
          end: employment.end,
          text: String(employment.description),
        }))
    ];
  }

  async setTakerTimelineSpans() {
    const currentTaker = this._lessonTakerType === 'pupil' ? this._pupilField.value : this._groupField.value;
    if (currentTaker === null) {
      return;
    }

    const relevantLessons = this._schedule.lessons
        .filter(lesson => lesson.lessonTaker === currentTaker.lessonTakerId && lesson.weekDay === this.selectedDay);
    if (!lessonRepository.isSynchronized) {
      return;
    }

    const relevantExtraEmployments = this._schedule.extraEmployments
        .filter(employment => employment.person === currentTaker.id && employment.weekDay === this.selectedDay);
    if (!extraEmploymentRepository.isSynchronized) { // proxy issynced to schedule entity
      return;
    }
    this._takerTimeline.spans = [...relevantLessons.map(lesson => ({
      start: lesson.start,
      end: lesson.end,
      text: String(lesson.subject), // todo map to subject name
    })),
      ...relevantExtraEmployments.map(employment => ({
        start: employment.start,
        end: employment.end,
        text: String(employment.description),
      }))
    ];
  }

  async setCommonTimelineSpans() {
    this._commonTimeline.spans = [
        ...this._teacherTimeline.spans,
        ...this._takerTimeline.spans,
    ];
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
          onConfirm: ({ start, end, description }) => {
            const currentTeacher = this._teacherField.value;
            if (currentTeacher === null) {
              throw new Error('No teacher found'); // TODO: handle errors
            }
            extraEmploymentRepository.addEntity({
              schedule: this._schedule.id,
              person: currentTeacher.id,
              weekDay: this._selectedDay,
              start,
              end,
              description,
            });
            this._confirmExtraEmployment = null;
          },
          onClose: () => {
            this._confirmExtraEmployment = null;
          }
        })
      },
    });
    this._takerTimeline = new TimelineVM({
      spans: [], // only allow drawing if taker is pupil not group!
      onSpanDrawingEnd: ({ start, end }) => {
        this._confirmExtraEmployment = new ConfirmExtraEmploymentVM({
          start,
          end,
          onConfirm: ({ start, end, description }) => {
            const currentPupil = this._pupilField.value;
            if (currentPupil === null) {
              throw new Error('No pupil found'); // TODO: handle errors
            }
            extraEmploymentRepository.addEntity({
              schedule: this._schedule.id,
              person: currentPupil.id,
              weekDay: this._selectedDay,
              start,
              end,
              description,
            });
            this._confirmExtraEmployment = null;
          },
          onClose: () => {
            this._confirmExtraEmployment = null;
          }
        })
      },
    });
    this._commonTimeline = new TimelineVM({
      spans: [], // only allow drawing if taker is pupil not group!
      onSpanDrawingEnd: ({ start, end }) => {
        this._confirmLesson = new ConfirmLessonVM({
          start,
          end,
          filterSubjects: () => true, //fix
          onSubmit: ({ start, end, subject }) => {
            const currentTaker = this._lessonTakerType === 'pupil' ? this._pupilField.value : this._groupField.value;
            const currentTeacher = this._teacherField.value;
            if (currentTaker === null || currentTeacher === null) {
              throw new Error('No pupil or teacher found'); // TODO: handle errors
            }
            lessonRepository.addEntity({
              schedule: this._schedule.id,
              lessonTaker: currentTaker.lessonTakerId,
              teacher: currentTeacher.id,
              weekDay: this._selectedDay,
              start,
              end,
              subject,
            });
            this._confirmLesson = null;
          },
          onClose: () => {
            this._confirmLesson = null;
          }
        })
      },
    });
    makeAutoObservable(this);
    autorun(() => this.setTeacherTimelineSpans());
    autorun(() => this.setTakerTimelineSpans());
    autorun(() => this.setCommonTimelineSpans());
  }
}
