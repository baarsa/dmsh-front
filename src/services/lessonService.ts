import { ILesson } from "../entities/ILesson";
import { IEntityService } from "./shared";
import { api } from "./__api";

export const lessonService: IEntityService<ILesson> = {
  async fetchAll() {
    //return api.get("lesson/all");
    const items = await api.get("lesson/all");
    items[0].assistance = { teacher: 9, start: 0, end: 30 };
    return items;
  },
  async fetchById(id: number) {
    return api.get(`lesson/${id}`);
  },
  async saveToServer(data: ILesson) {
    return api.post("lesson", data);
  },
  async update(id: number, data: Partial<ILesson>) {
    return api.post(`lesson/${id}`, data);
  },
  async remove(id: number) {
    await api.delete(`lesson/${id}`);
  },
};
