import { ILesson } from "../entities/ILesson";
import { IEntityService } from "./shared";

let current = 1;
let items = [
  {
    id: current++,
    schedule: 1,
    lessonTaker: 1,
    teacher: 1,
    subject: 1,
    weekDay: 0,
    start: 16 * 60,
    end: 17 * 60,
  },
  {
    id: current++,
    schedule: 1,
    lessonTaker: 1,
    teacher: 1,
    subject: 1,
    weekDay: 0,
    start: 10 * 60,
    end: 11.5 * 60,
  },
  {
    id: current++,
    schedule: 1,
    lessonTaker: 50,
    teacher: 1,
    subject: 1,
    weekDay: 0,
    start: 17.5 * 60,
    end: 18.5 * 60,
  },
];

// total fake
export const lessonService: IEntityService<ILesson> = {
  async fetchAll() {
    return items;
  },
  async fetchById(_id: number) {
    return items.find(({ id }) => id === _id) ?? null;
  },
  async saveToServer(data: ILesson) {
    const newItem = {
      id: current++,
      ...data,
    };
    items = [...items, newItem];
    return newItem;
  },
  async update(id: number, data: ILesson) {
    items = items.map((teacher) =>
      teacher.id === id ? { ...teacher, ...data } : teacher
    );
    return {
      id,
      ...data,
    };
  },
  async remove(_id: number) {
    items = items.filter(({ id }) => id !== _id);
  },
};
