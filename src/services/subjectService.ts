import { ISubject } from "../entities/ISubject";
import { IEntityService } from "./shared";

// total fake
export const subjectService: IEntityService<ISubject> = {
  async fetchById(id: number) {
    return {
      id: 1,
      name: "Solfeggio",
      isSpecial: false,
      specialityGroup: null
    };
  },
  async saveToServer(data: ISubject) {
    return {
      id: 1,
      ...data
    };
  },
  async update(id: number, data: ISubject) {
    return {
      id,
      ...data
    };
  },
  async remove(id: number) {
    return;
  }
};
