import { makeAutoObservable } from "mobx";
import { UserFormVM } from "../../forms/UserFormVM";
import { UserFormBuilder } from "./UserFormBuilder";

export class CreateUserVM {
  get form(): UserFormVM | null {
    return this._form;
  }
  private _form: UserFormVM | null = null;

  private async _init() {
    this._form = await UserFormBuilder.buildForm({ mode: "edit" });
  }

  constructor() {
    void this._init();
    makeAutoObservable(this);
  }
}
