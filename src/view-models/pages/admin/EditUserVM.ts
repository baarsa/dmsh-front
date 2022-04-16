import { makeAutoObservable } from "mobx";
import { UserFormVM } from "../../forms/UserFormVM";
import { UserFormBuilder } from "./UserFormBuilder";

export class EditUserVM {
  get form(): UserFormVM | null {
    return this._form;
  }
  private _form: UserFormVM | null = null;

  private async _init(userId: number) {
    this._form = await UserFormBuilder.buildForm({
      mode: "edit",
      userId,
    });
  }

  constructor(userId: number) {
    void this._init(userId);
    makeAutoObservable(this);
  }
}
