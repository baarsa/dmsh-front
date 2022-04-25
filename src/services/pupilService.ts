import { IEntityService } from "./shared";
import { IPupil } from "../entities/IPupil";
import { api } from "./__api";

export const pupilService: IEntityService<IPupil> = {
  async fetchAll() {
    return api.get("pupil/all");
  },
  async fetchById(id: number) {
    return api.get(`pupil/${id}`);
  },
  async saveToServer(data: IPupil) {
    return api.post("pupil", data);
  },
  async update(id: number, data: Partial<IPupil>) {
    return api.post(`pupil/${id}`, data);
  },
  async remove(id: number) {
    await api.delete(`pupil/${id}`);
  },
};
