import { makeAutoObservable } from "mobx";
import { IFormModel } from "../../../forms/FormModel";
import { GroupFormBuilder } from "./GroupFormBuilder";

export class EditGroupVM {
  get form(): IFormModel | null {
    return this._form;
  }
  private _form: IFormModel | null = null;

  private async _init(groupId: number) {
    this._form = await GroupFormBuilder.buildForm({
      mode: "edit",
      groupId,
    });
  }

  constructor(groupId: number) {
    void this._init(groupId);
    makeAutoObservable(this);
  }
}
