import { IFormModel } from "../../../forms/FormModel";
import { makeAutoObservable } from "mobx";
import { TeacherFormBuilder } from "./TeacherFormBuilder";

export class CreateTeacherVM {
  get form(): IFormModel | null {
    return this._form;
  }
  private _form: IFormModel | null = null;

  private async _init() {
    this._form = await TeacherFormBuilder.buildForm({ mode: "edit" });
  }

  constructor() {
    void this._init();
    makeAutoObservable(this);
  }
}
