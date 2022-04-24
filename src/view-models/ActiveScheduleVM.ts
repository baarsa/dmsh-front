import { IScheduleContextStore } from "../models/schedule-context-store/IScheduleContextStore";
import { ILinkField } from "./fields/ILinkField";
import { LinkFieldVM } from "./fields/LinkField";
import { scheduleRepository } from "../models/schedule/ScheduleRepository";
import { ScheduleEntity } from "../models/schedule/ScheduleEntity";
import {autorun, makeAutoObservable} from "mobx";

export class ActiveScheduleVM {
  get isLoading(): boolean {
    return this._isLoading;
  }
  get scheduleField(): ILinkField {
    return this._scheduleField;
  }
  private _scheduleContextStore: IScheduleContextStore;
  private _updateCurrentSchedule(schedule: ScheduleEntity | null) {
    this._scheduleContextStore.currentSchedule = schedule;
  }
  private _scheduleField: ILinkField = new LinkFieldVM(
    {
      label: "Текущее расписание",
    },
    {
      entityModel: scheduleRepository,
      valueChangedCallback: (values) => {
        this._updateCurrentSchedule(values.length > 0 ? values[0] : null);
      },
    }
  );

  private _isLoading = true;

  constructor(store: IScheduleContextStore) {
    this._scheduleContextStore = store;
    autorun(() => {
      if (!this._scheduleContextStore.isLoading && this._isLoading) {
        this._scheduleField.setValues(
            store.currentSchedule === null ? [] : [store.currentSchedule.id]
        );
        this._isLoading = false;
      }
    });
    makeAutoObservable(this);
  }
}
