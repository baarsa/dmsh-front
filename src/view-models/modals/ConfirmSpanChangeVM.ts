import { ModalVM } from "./ModalVM";
import { configStore } from "../../models/config-store/ConfigStore";
import { makeObservable, observable } from "mobx";

type Parameters = {
  text: string;
  info: string;
  start: number;
  end: number;
  onSubmit: (parameters: SubmitParameters) => void;
  onClose: () => void;
};

type SubmitParameters = {
  start: number;
  end: number;
};

export class ConfirmSpanChangeVM extends ModalVM {
  get info(): string {
    return this._info;
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
  get text(): string {
    return this._text;
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
    return this.isStartValid() && this.isEndValid() && this._start < this._end;
  }

  private readonly _text: string;
  private readonly _info: string;
  private _start: number;
  private _end: number;

  handleSubmit() {
    this._onSubmit({
      start: this._start,
      end: this._end,
    });
  }
  _onSubmit: (parameters: SubmitParameters) => void;

  constructor({ text, info, start, end, onSubmit, onClose }: Parameters) {
    super(onClose);
    this._text = text;
    this._info = info;
    this._start = start;
    this._end = end;
    this._onSubmit = onSubmit;
    makeObservable<ConfirmSpanChangeVM, "_start" | "_end">(this, {
      _start: observable,
      _end: observable,
    });
  }
}
