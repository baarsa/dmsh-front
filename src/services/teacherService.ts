import { IEntityService } from "./shared";
import { ITeacher } from "../entities/ITeacher";
import {api} from "./__api";

export const teacherService: IEntityService<ITeacher> = {
  async fetchAll() {
    return api.get('teacher/all');
  },
  async fetchById(id: number) {
    return api.get(`teacher/${id}`);
  },
  async saveToServer(data: ITeacher) {
    return api.post('teacher', data);
  },
  async update(id: number, data: Partial<ITeacher>) {
    return api.post(`teacher/${id}`, data);
  },
  async remove(id: number) {
    await api.delete(`teacher/${id}`)
  },
};
