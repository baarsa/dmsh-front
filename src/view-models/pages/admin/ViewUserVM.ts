import { makeAutoObservable } from "mobx";
import { UserFormVM } from "../../forms/UserFormVM";
import { UserFormBuilder } from "./UserFormBuilder";

export class ViewUserVM {
  get form(): UserFormVM | null {
    return this._form;
  }
  private _form: UserFormVM | null = null;

  private async _init(userId: number) {
    this._form = await UserFormBuilder.buildForm({
      mode: "view",
      userId,
    });
  }

  constructor(programId: number) {
    void this._init(programId);
    makeAutoObservable(this);
  }
}
