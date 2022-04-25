import { IExtraEmployment } from "../entities/IExtraEmployment";
import { IEntityService } from "./shared";
import { api } from "./__api";
import { Stored } from "../models/shared";

export const extraEmploymentService: IEntityService<IExtraEmployment> = {
  async fetchAll() {
    return (await api.get(
      "extra-employment/all"
    )) as Stored<IExtraEmployment>[];
  },
  async fetchById(id: number) {
    return (await api.get(
      `extra-employment/${id}`
    )) as Stored<IExtraEmployment>;
  },
  async saveToServer(data: IExtraEmployment) {
    return (await api.post(
      "extra-employment",
      data
    )) as Stored<IExtraEmployment>;
  },
  async update(id: number, data: Partial<IExtraEmployment>) {
    return (await api.post(
      `extra-employment/${id}`,
      data
    )) as Stored<IExtraEmployment>;
  },
  async remove(id: number) {
    await api.delete(`extra-employment/${id}`);
  },
};
