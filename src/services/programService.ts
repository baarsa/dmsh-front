import { IEntityService } from "./shared";
import { IProgram } from "../entities/IProgram";
import { api } from "./__api";

export const programService: IEntityService<IProgram> = {
  async fetchAll() {
    return api.get("program/all");
  },
  async fetchById(id: number) {
    return api.get(`program/${id}`);
  },
  async saveToServer(data: IProgram) {
    return api.post("program", data);
  },
  async update(id: number, data: Partial<IProgram>) {
    return api.post(`program/${id}`, data);
  },
  async remove(id: number) {
    await api.delete(`program/${id}`);
  },
};
