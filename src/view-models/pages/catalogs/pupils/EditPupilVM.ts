import { IFormModel } from "../../../forms/FormModel";
import { makeAutoObservable } from "mobx";
import { PupilFormBuilder } from "./PupilFormBuilder";

export class EditPupilVM {
  get form(): IFormModel | null {
    return this._form;
  }
  private _form: IFormModel | null = null;

  private async _init(pupilId: number) {
    this._form = await PupilFormBuilder.buildForm({
      mode: "edit",
      pupilId,
    });
  }

  constructor(groupId: number) {
    void this._init(groupId);
    makeAutoObservable(this);
  }
}
