import { ILesson } from "../entities/ILesson";
import { IEntityService } from "./shared";
import { api } from "./__api";
import {Stored} from "../models/shared";

export interface LessonService extends IEntityService<ILesson> {
  deleteAssistance: (id: number) => Promise<Stored<ILesson>>;
}

export const lessonService: LessonService = {
  async fetchAll() {
    return api.get("lesson/all");
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
  async deleteAssistance(id: number) {
    return api.get(`lesson/${id}/delete-assistance`);
  },
};
