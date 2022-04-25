import { IEntityService } from "./shared";
import { ILoad } from "../entities/ILoad";
import { api } from "./__api";

export const loadService: IEntityService<ILoad> = {
  async fetchAll() {
    return api.get("load/all");
  },
  async fetchById(id: number) {
    return api.get(`load/${id}`);
  },
  async saveToServer(data: ILoad) {
    return api.post("load", data);
  },
  async update(id: number, data: Partial<ILoad>) {
    return api.post(`load/${id}`, data);
  },
  async remove(id: number) {
    await api.delete(`load/${id}`);
  },
};
