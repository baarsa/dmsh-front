import { IScheduleContextStore } from "./IScheduleContextStore";
import { ScheduleEntity } from "../schedule/ScheduleEntity";
import {
  IScheduleContextService,
  scheduleContextService,
} from "../../services/schedule-context-service";
import { scheduleRepository } from "../schedule/ScheduleRepository";

class ScheduleContextStore implements IScheduleContextStore {
  get currentSchedule() {
    return this._schedule;
  }

  set currentSchedule(schedule) {
    this._schedule = schedule;
    void this._service.setCurrentScheduleId(schedule?.id ?? null);
  }

  private _schedule: ScheduleEntity | null = null;
  private _service: IScheduleContextService;

  private async _init() {
    const scheduleId = await this._service.getCurrentScheduleId();
    if (scheduleId === null) {
      return;
    }
    this._schedule = await scheduleRepository.getEntityById(scheduleId);
    // maybe add loading state;
  }

  constructor(service: IScheduleContextService) {
    this._service = service;
    void this._init();
  }
}

export const scheduleContextStore = new ScheduleContextStore(
  scheduleContextService
);
