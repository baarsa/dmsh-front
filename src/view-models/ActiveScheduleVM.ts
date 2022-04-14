import { IScheduleContextStore } from "../models/schedule-context-store/IScheduleContextStore";
import { ILinkField } from "./fields/ILinkField";
import { LinkFieldVM } from "./fields/LinkField";
import { scheduleRepository } from "../models/schedule/ScheduleRepository";
import { ScheduleEntity } from "../models/schedule/ScheduleEntity";

export class ActiveScheduleVM {
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

  constructor(store: IScheduleContextStore) {
    this._scheduleContextStore = store;
    this._scheduleField.setValues(
      store.currentSchedule === null ? [] : [store.currentSchedule.id]
    );
  }
}
