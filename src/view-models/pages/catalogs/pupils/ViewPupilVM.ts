import { IFormModel } from "../../../forms/FormModel";
import { makeAutoObservable } from "mobx";
import { PupilFormBuilder } from "./PupilFormBuilder";

export class ViewPupilVM {
  get form(): IFormModel | null {
    return this._form;
  }
  private _form: IFormModel | null = null;

  private async _init(pupilId: number) {
    this._form = await PupilFormBuilder.buildForm({
      mode: "view",
      pupilId,
    });
  }

  constructor(pupilId: number) {
    void this._init(pupilId);
    makeAutoObservable(this);
  }
}
