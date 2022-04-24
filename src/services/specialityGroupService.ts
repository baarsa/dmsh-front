import { IEntityService } from "./shared";
import { ISpecialityGroup } from "../entities/ISpecialityGroup";
import {api} from "./__api";

export const specialityGroupService: IEntityService<ISpecialityGroup> = {
  async fetchAll() {
    return api.get('speciality-group/all');
  },
  async fetchById(id: number) {
    return api.get(`speciality-group/${id}`);
  },
  async saveToServer(data: ISpecialityGroup) {
    return api.post('speciality-group', data);
  },
  async update(id: number, data: Partial<ISpecialityGroup>) {
    return api.post(`speciality-group/${id}`, data);
  },
  async remove(id: number) {
    await api.delete(`speciality-group/${id}`)
  },
};
