import { IGroup } from "../entities/IGroup";
import { IEntityService } from "./shared";
import {api} from "./__api";

export const groupService: IEntityService<IGroup> = {
  async fetchAll() {
    return api.get('group/all');
  },
  async fetchById(id: number) {
    return api.get(`group/${id}`);
  },
  async saveToServer(data: IGroup) {
    return api.post('group', data);
  },
  async update(id: number, data: Partial<IGroup>) {
    return api.post(`group/${id}`, data);
  },
  async remove(id: number) {
    await api.delete(`group/${id}`)
  },
};
