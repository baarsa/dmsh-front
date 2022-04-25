import { ISubject } from "../entities/ISubject";
import { IEntityService } from "./shared";
import { api } from "./__api";

export const subjectService: IEntityService<ISubject> = {
  async fetchAll() {
    return api.get("subject/all");
  },
  async fetchById(id: number) {
    return api.get(`subject/${id}`);
  },
  async saveToServer(data: ISubject) {
    return api.post("subject", data);
  },
  async update(id: number, data: Partial<ISubject>) {
    return api.post(`subject/${id}`, data);
  },
  async remove(id: number) {
    await api.delete(`subject/${id}`);
  },
};
