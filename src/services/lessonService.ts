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
    weekDay: 1,
    start: 16 * 60,
    end: 17 * 60,
  },
  {
    id: current++,
    schedule: 1,
    lessonTaker: 1,
    teacher: 2,
    subject: 1,
    weekDay: 0,
    start: 19 * 60,
    end: 20 * 60,
  },
  {
    id: current++,
    schedule: 1,
    lessonTaker: 50,
    teacher: 1,
    subject: 3,
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
  async update(id: number, data: Partial<ILesson>) {
    items = items.map((item) => (item.id === id ? { ...item, ...data } : item));
    const newItem = items.find((item) => item.id === id);
    if (newItem === undefined) {
      throw new Error();
    }
    return newItem;
  },
  async remove(_id: number) {
    items = items.filter(({ id }) => id !== _id);
  },
};
