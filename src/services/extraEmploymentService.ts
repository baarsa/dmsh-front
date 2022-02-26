import { IExtraEmployment } from "../entities/IExtraEmployment";
import { IEntityService } from "./shared";

// total fake
export const extraEmploymentService: IEntityService<IExtraEmployment> = {
  async fetchById(id: number) {
    return {
      id,
      weekDay: 1,
      start: 600,
      end: 680,
      person: 1,
      description: "Some employment"
    };
  },
  async saveToServer(data: IExtraEmployment) {
    return {
      id: 1,
      ...data
    };
  },
  async update(id: number, data: IExtraEmployment) {
    return {
      id,
      ...data
    };
  },
  async remove(id: number) {
    return;
  }
};
