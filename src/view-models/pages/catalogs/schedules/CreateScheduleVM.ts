import { makeAutoObservable } from "mobx";
import { ScheduleFormVM } from "../../../forms/ScheduleFormVM";
import { ScheduleFormBuilder } from "./ScheduleFormBuilder";

export class CreateScheduleVM {
  get form(): ScheduleFormVM | null {
    return this._form;
  }
  private _form: ScheduleFormVM | null = null;

  private async _init() {
    this._form = await ScheduleFormBuilder.buildForm({ mode: "edit" });
  }

  constructor() {
    void this._init();
    makeAutoObservable(this);
  }
}
