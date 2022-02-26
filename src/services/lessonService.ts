import { ILesson } from "../entities/ILesson";
import { IEntityService } from "./shared";

// total fake
export const lessonService: IEntityService<ILesson> = {
  async fetchById(id: number) {
    return {
      id,
      weekDay: 0,
      start: 600,
      end: 680,
      lessonTaker: 1,
      teacher: 1,
      subject: 1
    };
  },
  async saveToServer(data: ILesson) {
    return {
      id: 1,
      ...data
    };
  },
  async update(id: number, data: ILesson) {
    return {
      id,
      ...data
    };
  },
  async remove(id: number) {
    return;
  }
};
