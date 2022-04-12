import { makeAutoObservable } from "mobx";
import { ProgramFormModel } from "../../../forms/ProgramFormModel";
import { ProgramFormBuilder } from "./ProgramFormBuilder";

export class EditProgramVM {
  get form(): ProgramFormModel | null {
    return this._form;
  }
  private _form: ProgramFormModel | null = null;

  private async _init(programId: number) {
    this._form = await ProgramFormBuilder.buildForm({
      mode: "edit",
      programId,
    });
  }

  constructor(programId: number) {
    void this._init(programId);
    makeAutoObservable(this);
  }
}
