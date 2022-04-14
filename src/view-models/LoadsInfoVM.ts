import { pupilRepository } from "../models/pupil/PupilRepository";
import { programRepository } from "../models/program/ProgramRepository";
import { ACADEMIC_HOUR } from "../const";
import { autorun, makeAutoObservable } from "mobx";
import { subjectRepository } from "../models/subject/SubjectRepository";
import { ScheduleEntity } from "../models/schedule/ScheduleEntity";
import { groupRepository } from "../models/group/GroupRepository";
import { scheduleContextStore } from "../models/schedule-context-store/ScheduleContextStore";

type LoadItem = {
  text: string;
  assignedCount: number; // minutes
  totalCount: number; // minutes
};

export class LoadsInfoVM {
  set teacherId(value: number) {
    this._teacherId = value;
  }
  set isOpen(value: boolean) {
    this._isOpen = value;
  }
  get isOpen(): boolean {
    return this._isOpen;
  }
  set title(value: string) {
    this._title = value;
  }
  get title() {
    return this._title;
  }
  get items(): LoadItem[] {
    if (!this._isSynchronized) {
      void this._calculateItems();
    }
    return this._items;
  }
  private _calculateItems() {
    const loads = this._schedule.loads.filter(
      (load) => load.teacher === this._teacherId
    );
    const lessons = this._schedule.lessons.filter(
      (lesson) => lesson.teacher === this._teacherId
    );
    const pupils = pupilRepository.entities;
    const groups = Object.values(groupRepository.entities);
    const subjects = subjectRepository.entities;
    const allPrograms = programRepository.entities;
    if (!programRepository.isSynchronized) {
      return;
    }

    this._items = loads.map((load) => {
      const loadPupil = load.pupil;
      const pupil = pupils[load.pupil];
      const lessonTakersWithPupil = [
        pupil.lessonTakerId,
        ...groups
          .filter((group) => group.pupils.includes(loadPupil))
          .map((group) => group.lessonTakerId),
      ]; // сам ученик и все группы, в которые он входит
      const lessonsForLoad = lessons.filter(
        (lesson) =>
          lessonTakersWithPupil.includes(lesson.lessonTaker) &&
          lesson.subject === load.subject
      );

      const year = this._schedule.pupilsYears[load.pupil];
      const pupilProgram = allPrograms[pupil.program];
      if (pupilProgram === undefined) {
        throw new Error();
      }
      const yearPlan = pupilProgram.yearPlans[year];
      const halfHoursForSubject =
        load.subject === pupil.specialSubject
          ? yearPlan.specialityHalfHours
          : yearPlan.commonSubjectsHalfHours[load.subject];

      return {
        text: `${subjects[load.subject].name} для ${pupils[load.pupil].name}`,
        assignedCount: lessonsForLoad.reduce(
          (acc, lesson) => acc + lesson.end - lesson.start,
          0
        ),
        totalCount: (halfHoursForSubject * ACADEMIC_HOUR) / 2,
      };
    });
    this._isSynchronized = true;
  }

  private _items: LoadItem[] = [];
  private _isSynchronized: boolean = false;
  private _isOpen: boolean = false;
  private _title: string = "";
  private _teacherId: number | null = null;
  private _schedule: ScheduleEntity;

  constructor(schedule: ScheduleEntity) {
    this._schedule = schedule;
    makeAutoObservable(this);
    autorun(() => {
      if (scheduleContextStore.currentSchedule === null) {
        throw new Error("Не найдено текущее расписание");
      }
      this._schedule = scheduleContextStore.currentSchedule;
    });
    autorun(() => this._calculateItems());
  }
}
