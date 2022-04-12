import { IFormModel } from "../../../forms/FormModel";
import { makeAutoObservable } from "mobx";
import { TeacherFormBuilder } from "./TeacherFormBuilder";

export class ViewTeacherVM {
  get form(): IFormModel | null {
    return this._form;
  }
  private _form: IFormModel | null = null;

  private async _init(teacherId: number) {
    this._form = await TeacherFormBuilder.buildForm({
      mode: "view",
      teacherId,
    });
  }

  constructor(subjectId: number) {
    void this._init(subjectId);
    makeAutoObservable(this);
  }
}
