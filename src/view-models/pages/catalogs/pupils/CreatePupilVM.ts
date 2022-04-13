import { IFormModel } from "../../../forms/FormModel";
import { makeAutoObservable } from "mobx";
import { PupilFormBuilder } from "./PupilFormBuilder";

export class CreatePupilVM {
  get form(): IFormModel | null {
    return this._form;
  }
  private _form: IFormModel | null = null;

  private async _init() {
    this._form = await PupilFormBuilder.buildForm({ mode: "edit" });
  }

  constructor() {
    void this._init();
    makeAutoObservable(this);
  }
}
