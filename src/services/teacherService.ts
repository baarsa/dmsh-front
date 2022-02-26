import { IEntityService } from "./shared";
import { ITeacher } from "../entities/ITeacher";

// total fake
export const teacherService: IEntityService<ITeacher> = {
  async fetchById(id: number) {
    return {
      id,
      name: "Obi-Wan Kenobi",
      canAssist: true,
      subjects: [1, 2, 3]
    };
  },
  async saveToServer(data: ITeacher) {
    return {
      id: 1,
      ...data
    };
  },
  async update(id: number, data: ITeacher) {
    return {
      id,
      ...data
    };
  },
  async remove(id: number) {
    return;
  }
};
