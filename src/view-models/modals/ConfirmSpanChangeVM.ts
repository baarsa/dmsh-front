import { ModalVM } from "./ModalVM";

type Parameters = {
  text: string;
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
  private readonly _text: string;
  private _start: number;
  private _end: number;

  handleSubmit() {
    this._onSubmit({
      start: this._start,
      end: this._end,
    });
  }
  _onSubmit: (parameters: SubmitParameters) => void;

  constructor({ text, start, end, onSubmit, onClose }: Parameters) {
    super(onClose);
    this._text = text;
    this._start = start;
    this._end = end;
    this._onSubmit = onSubmit;
  }
}
