import { makeAutoObservable } from "mobx";
import { IFormModel } from "../../../forms/FormModel";
import { GroupFormBuilder } from "./GroupFormBuilder";

export class CreateGroupVM {
  get form(): IFormModel | null {
    return this._form;
  }
  private _form: IFormModel | null = null;

  private async _init() {
    this._form = await GroupFormBuilder.buildForm({ mode: "edit" });
  }

  constructor() {
    void this._init();
    makeAutoObservable(this);
  }
}
