import { ModalVM } from "./ModalVM";

type Parameters = {
  text: string;
  onConfirm: () => void;
  onClose: () => void;
};

export class ConfirmActionVM extends ModalVM {
  get text(): string {
    return this._text;
  }
  private readonly _text: string;

  handleConfirm() {
    this._onConfirm();
  }
  private readonly _onConfirm: () => void;

  constructor({ text, onConfirm, onClose }: Parameters) {
    super(onClose);
    this._text = text;
    this._onConfirm = onConfirm;
  }
}
