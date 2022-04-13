import { ScheduleFormVM } from "../../../forms/ScheduleFormVM";
import { ScheduleFormBuilder } from "./ScheduleFormBuilder";
import { makeAutoObservable } from "mobx";

export class ViewScheduleVM {
  get form(): ScheduleFormVM | null {
    return this._form;
  }
  private _form: ScheduleFormVM | null = null;

  private async _init(scheduleId: number) {
    this._form = await ScheduleFormBuilder.buildForm({
      mode: "view",
      scheduleId,
    });
  }

  constructor(scheduleId: number) {
    void this._init(scheduleId);
    makeAutoObservable(this);
  }
}
