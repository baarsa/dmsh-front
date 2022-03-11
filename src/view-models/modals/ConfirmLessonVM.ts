import { ModalVM } from "./ModalVM";
import { LinkFieldVM } from "../fields/LinkField";
import { SubjectEntity } from "../../models/subject/SubjectEntity";
import { subjectRepository } from "../../models/subject/SubjectRepository";
import { makeObservable, observable } from "mobx";

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
};

export class ConfirmLessonVM extends ModalVM {
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
  private _start: number;
  private _end: number;
  private readonly _subject: LinkFieldVM<SubjectEntity>;

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
  }: ConfirmLessonParameters) {
    super(onClose);
    this._start = start;
    this._end = end;
    this._subject = new LinkFieldVM<SubjectEntity>(
      { label: "Предмет" },
      subjectRepository,
      filterSubjects
    );
    this._onSubmit = onSubmit;
    makeObservable<ConfirmLessonVM, "_start" | "_end">(this, {
      _start: observable,
      _end: observable,
    });
  }
}
