import { IFormModel } from "../../../forms/FormModel";
import { makeAutoObservable } from "mobx";
import { SubjectFormBuilder } from "./SubjectFormBuilder";

export class EditSubjectViewModel {
  get form(): IFormModel | null {
    return this._form;
  }
  private _form: IFormModel | null = null;

  private async _init(subjectId: number) {
    this._form = await SubjectFormBuilder.buildForm({
      mode: "edit",
      subjectId,
    });
  }

  constructor(subjectId: number) {
    void this._init(subjectId);
    makeAutoObservable(this);
  }
}
