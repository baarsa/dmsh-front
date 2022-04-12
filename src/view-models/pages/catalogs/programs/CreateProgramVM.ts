import { makeAutoObservable } from "mobx";
import { ProgramFormModel } from "../../../forms/ProgramFormModel";
import { ProgramFormBuilder } from "./ProgramFormBuilder";

export class CreateProgramVM {
  get form(): ProgramFormModel | null {
    return this._form;
  }
  private _form: ProgramFormModel | null = null;

  private async _init() {
    this._form = await ProgramFormBuilder.buildForm({ mode: "edit" });
  }

  constructor() {
    void this._init();
    makeAutoObservable(this);
  }
}
