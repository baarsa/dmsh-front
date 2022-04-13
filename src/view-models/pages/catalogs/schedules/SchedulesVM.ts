import { autorun, makeAutoObservable } from "mobx";
import { scheduleRepository } from "../../../../models/schedule/ScheduleRepository";

export class SchedulesVM {
  get isLoading(): boolean {
    return this._isLoading;
  }
  get items() {
    return this._items;
  }
  private _items: {
    id: number;
    text: string;
  }[] = [];
  private _isLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      this._items = Object.values(scheduleRepository.entities).map(
        (entity) => ({
          id: entity.id,
          text: entity.name,
        })
      );
    });
    autorun(() => {
      this._isLoading = !scheduleRepository.isSynchronized;
    });
  }
}
