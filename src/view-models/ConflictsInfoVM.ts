import { ScheduleEntity } from "../models/schedule/ScheduleEntity";
import { WEEK_DAY_NAMES } from "../const";
import { autorun, makeAutoObservable } from "mobx";
import { pupilEntityRepository } from "../models/pupil/PupilRepository";
import { subjectRepository } from "../models/subject/SubjectRepository";
import { groupRepository } from "../models/group/GroupRepository";

type ConflictItem = {
  text: string;
  day: number;
  dayText: string;
};

type Span = {
  start: number;
  end: number;
};

const haveIntersection = (a: Span, b: Span) =>
  (a.start > b.start && a.start < b.end) ||
  (a.end > b.start && a.end < b.end) ||
  (a.start < b.start && a.end > b.end);

export class ConflictsInfoVM {
  set teacherId(value: number) {
    this._teacherId = value;
  }
  get isOpen(): boolean {
    return this._isOpen;
  }

  set isOpen(value: boolean) {
    this._isOpen = value;
  }
  get items(): ConflictItem[] {
    if (!this._isSynchronized) {
      void this._calculateItems();
    }
    return this._items;
  }

  handleWeekDayClick(weekDay: number) {
    this._onWeekDayClick(weekDay);
  }

  private _calculateItems() {
    const items: ConflictItem[] = [];
    const pupils = pupilEntityRepository.entities;
    const groups = groupRepository.entities;
    const subjects = subjectRepository.entities;
    const lessons = this._schedule.lessons.filter(
      (lesson) => lesson.teacher === this._teacherId
    );
    const employments = this._schedule.extraEmployments.filter(
      (employment) => employment.person === this._teacherId
    );
    const spans = [
      ...lessons.map((lesson) => {
        const isPupil = Object.values(pupils).some(
          (pupil) => pupil.lessonTakerId === lesson.lessonTaker
        );
        const takerName = isPupil
          ? Object.values(pupils).find(
              (pupil) => pupil.lessonTakerId === lesson.lessonTaker
            )?.name
          : Object.values(groups).find(
              (group) => group.lessonTakerId === lesson.lessonTaker
            )?.name;
        return {
          weekDay: lesson.weekDay,
          start: lesson.start,
          end: lesson.end,
          text: `урок ${subjects[lesson.subject].name} с ${
            isPupil ? "учеником" : "группой"
          } ${takerName}`,
        };
      }),
      ...employments.map((employment) => ({
        weekDay: employment.weekDay,
        start: employment.start,
        end: employment.end,
        text: employment.description,
      })),
    ];
    for (let i = 1; i < spans.length; i++) {
      for (let j = 0; j < i; j++) {
        const firstSpan = spans[i];
        const secondSpan = spans[j];
        if (firstSpan.weekDay !== secondSpan.weekDay) continue;
        if (!haveIntersection(firstSpan, secondSpan)) {
          continue;
        }
        items.push({
          text: `${firstSpan.text} и ${secondSpan.text}`,
          day: firstSpan.weekDay,
          dayText: WEEK_DAY_NAMES[firstSpan.weekDay],
        });
      }
    }
    this._items = items;
    this._isSynchronized = true;
  }
  private _items: ConflictItem[] = [];
  private _isSynchronized: boolean = false;
  private _isOpen: boolean = false;
  private _teacherId: number;
  private _schedule: ScheduleEntity;
  private readonly _onWeekDayClick: (weekDay: number) => void;

  constructor(
    schedule: ScheduleEntity,
    teacherId: number,
    onWeekDayClick: (weekDay: number) => void
  ) {
    this._schedule = schedule;
    this._teacherId = teacherId;
    this._onWeekDayClick = onWeekDayClick;
    makeAutoObservable(this);
    autorun(() => this._calculateItems());
    autorun(() => {
      if (this._items.length === 0) {
        this._isOpen = false;
      }
    });
  }
}