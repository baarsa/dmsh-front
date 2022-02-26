import { IPupil } from "../models/pupil/PupilEntity";
import { IEntityService } from "./shared";

// total fake
export const pupilService: IEntityService<IPupil> = {
  async fetchById(id: number) {
    return {
      id,
      name: "John Connor",
      specialSubject: 1,
      program: 1
    };
  },
  async saveToServer(data: IPupil) {
    return {
      id: 1,
      ...data
    };
  }
};
