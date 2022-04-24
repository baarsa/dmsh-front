import { IEntityService } from "./shared";
import { ISchedule } from "../entities/ISchedule";
import {api} from "./__api";

export const scheduleService: IEntityService<ISchedule> = {
  async fetchAll() {
    return api.get('schedule/all');
  },
  async fetchById(id: number) {
    return api.get(`schedule/${id}`);
  },
  async saveToServer(data: ISchedule) {
    return api.post('schedule', data);
  },
  async update(id: number, data: Partial<ISchedule>) {
    return api.post(`schedule/${id}`, data);
  },
  async remove(id: number) {
    await api.delete(`schedule/${id}`)
  },
};
