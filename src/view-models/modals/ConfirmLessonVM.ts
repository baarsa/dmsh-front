import { ModalVM } from "./ModalVM";
import { LinkFieldVM } from "../fields/LinkField";
import { SubjectEntity } from "../../models/subject/SubjectEntity";
import { subjectRepository } from "../../models/subject/SubjectRepository";
import { makeObservable, observable } from "mobx";
import { configStore } from "../../models/config-store/ConfigStore";

type SubmitParameters = {
  start: number;
  end: number;
  subject: number;
};

type ConfirmLessonParameters = {
  start: number;
  end: number;
  onSubmit: (parameters: SubmitParameters) => void;
  onClose: () => void;
  filterSubjects: (subject: SubjectEntity) => boolean;
  teacher: string;
  taker: string;
  weekDay: string;
};

export class ConfirmLessonVM extends ModalVM {
  get teacher(): string {
    return this._teacher;
  }

  get taker(): string {
    return this._taker;
  }

  get weekDay(): string {
    return this._weekDay;
  }
  get subject(): LinkFieldVM<SubjectEntity> {
    return this._subject;
  }
  get start(): number {
    return this._start;
  }

  set start(value: number) {
    this._start = value;
  }

  get end(): number {
    return this._end;
  }

  set end(value: number) {
    this._end = value;
  }

  isStartValid() {
    return (
      configStore.config !== null && this._start >= configStore.config.startTime
    );
  }

  isEndValid() {
    return (
      configStore.config !== null && this._end <= configStore.config.endTime
    );
  }

  isFormValid() {
    return (
      this.isStartValid() &&
      this.isEndValid() &&
      this._subject.isValid() &&
      this._start < this._end
    );
  }

  private _start: number;
  private _end: number;
  private readonly _subject: LinkFieldVM<SubjectEntity>;
  private readonly _teacher: string;
  private readonly _taker: string;
  private readonly _weekDay: string;

  handleConfirm() {
    const selectedSubject = this._subject.value;
    if (selectedSubject === null) {
      throw new Error("No subject selected");
    }
    this._onSubmit({
      start: this._start,
      end: this._end,
      subject: selectedSubject.id,
    });
  }
  _onSubmit: (parameters: SubmitParameters) => void;

  constructor({
    start,
    end,
    onClose,
    onSubmit,
    filterSubjects,
    teacher,
    taker,
    weekDay,
  }: ConfirmLessonParameters) {
    super(onClose);
    this._start = start;
    this._end = end;
    this._subject = new LinkFieldVM<SubjectEntity>(
      { label: "??????????????" },
      {
        entityModel: subjectRepository,
        entitiesFilter: filterSubjects,
      }
    );
    this._onSubmit = onSubmit;
    this._teacher = teacher;
    this._taker = taker;
    this._weekDay = weekDay;
    makeObservable<ConfirmLessonVM, "_start" | "_end">(this, {
      _start: observable,
      _end: observable,
    });
  }
}
