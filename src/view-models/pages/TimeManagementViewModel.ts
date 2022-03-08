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
  private _teacherTimeline: TimelineVM;
  //private _takerTimeline: TimelineVM;
  //private _commonTimeline: TimelineVM;

  //modal
  private _confirmExtraEmployment: ConfirmExtraEmploymentVM | null = null;
  // confirmLesson: ConfirmExtraEmploymentVM
  // these inherit from some ModalVM with isOpen: boolean and show time adjustment controls
  // and subject select (!)
  // and description input for employment and buttons ok/cancel

  // handling actions
  async _createLesson({
    start,
    end,
    subjectId
  }: {
    start: number;
    end: number;
    subjectId: number;
  }) {
    const lessonTakerId =
      this._lessonTakerType === "pupil"
        ? this._pupilField.value?.id
        : this._groupField.value?.id; // take care of nulls
    if (lessonTakerId === undefined || this._teacherField.value === null) {
      throw new Error(); // todo error handling
    }
    lessonRepository.addEntity({
      schedule: this._schedule.id,
      lessonTaker: lessonTakerId,
      teacher: this._teacherField.value.id,
      subject: subjectId,
      weekDay: this._selectedDay,
      start,
      end
    });
  }

  // view handlers
  handleDayChange(day: number) {
    this._selectedDay = day;
  }

  handleEndOfDrawing() {
    // show relevant modal
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

  get confirmExtraEmployment() {
    return this._confirmExtraEmployment;
  }

  //effects
  // set teacher timeline spans
  async setTeacherTimelineSpans() {
    // get spans for selected teacher
    console.log(getObserverTree(extraEmploymentRepository, 'entities'));
    const currentTeacher = this._teacherField.value;
    if (currentTeacher === null) {
      return;
    }

    const allLessons = lessonRepository.entities;
    if (!lessonRepository.isSynchronized) {
      return;
    }
    const relevantLessons = this._schedule.lessons
        .map(id => allLessons[id])
        .filter(lesson => lesson.teacher === currentTeacher.id && lesson.weekDay === this.selectedDay);

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
          }
        })
      },
    });
    makeAutoObservable(this);
    autorun(() => this.setTeacherTimelineSpans());
  }
}
