import { ProgramFormModel } from "../../../forms/ProgramFormModel";
import { ProgramFormBuilder } from "./ProgramFormBuilder";
import { makeAutoObservable } from "mobx";

export class ViewProgramVM {
  get form(): ProgramFormModel | null {
    return this._form;
  }
  private _form: ProgramFormModel | null = null;

  private async _init(programId: number) {
    this._form = await ProgramFormBuilder.buildForm({
      mode: "view",
      programId,
    });
  }

  constructor(programId: number) {
    void this._init(programId);
    makeAutoObservable(this);
  }
}
