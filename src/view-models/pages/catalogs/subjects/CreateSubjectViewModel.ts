import { IFormModel } from "../../../forms/FormModel";
import { SubjectFormBuilder } from "./SubjectFormBuilder";
import { makeAutoObservable } from "mobx";

export class CreateSubjectViewModel {
  get form(): IFormModel | null {
    return this._form;
  }
  private _form: IFormModel | null = null;

  private async _init() {
    this._form = await SubjectFormBuilder.buildForm({ mode: "edit" });
  }

  constructor() {
    void this._init();
    makeAutoObservable(this);
  }
}
