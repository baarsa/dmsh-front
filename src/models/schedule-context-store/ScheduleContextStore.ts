import { IScheduleContextStore } from "./IScheduleContextStore";
import { ScheduleEntity } from "../schedule/ScheduleEntity";
import {
  IScheduleContextService,
  scheduleContextService,
} from "../../services/schedule-context-service";
import { scheduleRepository } from "../schedule/ScheduleRepository";
import { makeAutoObservable } from "mobx";

class ScheduleContextStore implements IScheduleContextStore {
  get isLoading(): boolean {
    return this._isLoading;
  }
  get currentSchedule() {
    return this._schedule;
  }

  set currentSchedule(schedule) {
    this._schedule = schedule;
    void this._service.setCurrentScheduleId(schedule?.id ?? null);
  }

  private _schedule: ScheduleEntity | null = null;
  private _service: IScheduleContextService;
  private _isLoading = true;

  private async _init() {
    const scheduleId = await this._service.getCurrentScheduleId();
    if (scheduleId === null) {
      return;
    }
    this._schedule = await scheduleRepository.getEntityById(scheduleId);
    this._isLoading = false;
  }

  constructor(service: IScheduleContextService) {
    this._service = service;
    makeAutoObservable(this);
    void this._init();
  }
}

export const scheduleContextStore = new ScheduleContextStore(
  scheduleContextService
);
