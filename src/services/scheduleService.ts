import { IEntityService } from "./shared";
import { ISchedule } from "../entities/ISchedule";
import { api } from "./__api";
import {Stored} from "../models/shared";

export interface ScheduleService extends IEntityService<ISchedule> {
  copy(originalId: number, newName: string, nextYear: boolean): Promise<Stored<ISchedule>>;
}

export const scheduleService: ScheduleService = {
  async fetchAll() {
    return api.get("schedule/all");
  },
  async fetchById(id: number) {
    return api.get(`schedule/${id}`);
  },
  async saveToServer(data: ISchedule) {
    return api.post("schedule", data);
  },
  async update(id: number, data: Partial<ISchedule>) {
    return api.post(`schedule/${id}`, data);
  },
  async remove(id: number) {
    await api.delete(`schedule/${id}`);
  },
  async copy(originalId: number, newName: string, nextYear: boolean) {
    return await api.post('schedule/copy', {
      id: originalId,
      name: newName,
      nextYear,
    });
  }
};
