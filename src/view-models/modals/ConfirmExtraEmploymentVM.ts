import { StringFieldVM } from "../fields/StringField";
import { makeObservable, observable } from "mobx";
import { ModalVM } from "./ModalVM";
import { configStore } from "../../models/config-store/ConfigStore";

type SubmitParameters = {
  start: number;
  end: number;
  description: string;
};

export class ConfirmExtraEmploymentVM extends ModalVM {
  get person(): string {
    return this._person;
  }

  get weekDay(): string {
    return this._weekDay;
  }
  get description(): StringFieldVM {
    return this._description;
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

  isDescriptionValid() {
    return this._description.isValid();
  }

  isFormValid() {
    return (
      this.isStartValid() &&
      this.isEndValid() &&
      this.isDescriptionValid() &&
      this._start < this._end
    );
  }

  private _start: number;
  private _end: number;
  private _description: StringFieldVM = new StringFieldVM({
    label: "Описание",
  });
  private readonly _person: string;
  private readonly _weekDay: string;

  handleConfirm() {
    this._onConfirm({
      start: this._start,
      end: this._end,
      description: this._description.value,
    });
  }
  _onConfirm: (parameters: SubmitParameters) => void;

  constructor({
    start,
    end,
    person,
    weekDay,
    onConfirm,
    onClose,
  }: {
    start: number;
    end: number;
    person: string;
    weekDay: string;
    onConfirm: (parameters: SubmitParameters) => void;
    onClose: () => void;
  }) {
    super(onClose);
    this._start = start;
    this._end = end;
    this._onConfirm = onConfirm;
    this._person = person;
    this._weekDay = weekDay;
    makeObservable<ConfirmExtraEmploymentVM, "_start" | "_end">(this, {
      _start: observable,
      _end: observable,
    });
  }
}
