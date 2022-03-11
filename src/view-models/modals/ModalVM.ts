export class ModalVM {
  private readonly _onClose: () => void;
  handleClose() {
    this._onClose();
  }
  constructor(onClose: () => void) {
    this._onClose = onClose;
  }
}
