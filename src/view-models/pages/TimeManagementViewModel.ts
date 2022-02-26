import { makeAutoObservable } from "mobx";
import { GroupEntity } from "../../models/group/GroupEntity";
import { lessonEntityRepository } from "../../models/lesson/LessonRepository";
import { PupilEntity } from "../../models/pupil/PupilEntity";
import { TeacherEntity } from "../../models/teacher/TeacherEntity";
import { LinkFieldVM } from "../fields/LinkField";

type Params = {
  canChangeTeacher: boolean;
  teacherField: LinkFieldVM<TeacherEntity>;
  pupilField: LinkFieldVM<PupilEntity>;
  groupField: LinkFieldVM<GroupEntity>;
};

export class TimeManagementVM {
  private _selectedDay: number = 0;
  private _dayOptions = [
    { value: 0, text: "Понедельник" },
    { value: 1, text: "Вторник" }
  ];
  private _drawingSpan: {
    location: "teacher" | "middle" | "taker";
    start: number;
    end: number;
  } | null = null;
  private _canChangeTeacher: boolean;
  private _teacherField: LinkFieldVM<TeacherEntity>;
  private _lessonTakerType: "pupil" | "group" = "pupil";
  private _pupilField: LinkFieldVM<PupilEntity>;
  private _groupField: LinkFieldVM<GroupEntity>;

  //modal
  // confirmExtraEmployment: ConfirmExtraEmploymentVM
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
    lessonEntityRepository.addEntity({
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

  constructor(params: Params) {
    this._canChangeTeacher = params.canChangeTeacher;
    this._teacherField = params.teacherField;
    this._pupilField = params.pupilField;
    this._groupField = params.groupField;
    makeAutoObservable(this);
  }
}
