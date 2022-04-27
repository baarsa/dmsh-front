import { ModalVM } from "./ModalVM";

type Parameters = {
  title: string;
  text: string;
  onConfirm: () => void;
  onClose: () => void;
};

export class ConfirmActionVM extends ModalVM {
  get title(): string {
    return this._title;
  }
  get text(): string {
    return this._text;
  }
  private readonly _title: string;
  private readonly _text: string;

  handleConfirm() {
    this._onConfirm();
  }
  private readonly _onConfirm: () => void;

  constructor({ title, text, onConfirm, onClose }: Parameters) {
    super(onClose);
    this._title = title;
    this._text = text;
    this._onConfirm = onConfirm;
  }
}
