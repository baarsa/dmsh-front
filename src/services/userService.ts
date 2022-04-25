import { IEntityService } from "./shared";
import { IUser } from "../entities/IUser";
import { api } from "./__api";

export const userService: IEntityService<IUser> = {
  async fetchAll() {
    return api.get("user/all");
  },
  async fetchById(id: number) {
    return api.get(`user/${id}`);
  },
  async saveToServer(data: IUser) {
    return api.post("user", data);
  },
  async update(id: number, data: Partial<IUser>) {
    return api.post(`user/${id}`, data);
  },
  async remove(id: number) {
    await api.delete(`user/${id}`);
  },
};
