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
    start: 15 * 60 + 20,
    end: 16 * 60,
  },
  {
    id: current++,
    schedule: 1,
    lessonTaker: 1,
    teacher: 1,
    subject: 1,
    weekDay: 3,
    start: 14 * 60,
    end: 14 * 60 + 40,
  },
  {
    id: current++,
    schedule: 1,
    lessonTaker: 1,
    teacher: 1,
    subject: 3,
    weekDay: 0,
    start: 16 * 60 + 5,
    end: 16 * 60 + 25,
  },
  {
    id: current++,
    schedule: 1,
    lessonTaker: 1,
    teacher: 1,
    subject: 3,
    weekDay: 1,
    start: 14 * 60,
    end: 14 * 60 + 40,
  },
  {
    id: current++,
    schedule: 1,
    lessonTaker: 1003, // хор
    teacher: 6,
    subject: 4,
    weekDay: 1,
    start: 15 * 60,
    end: 15 * 60 + 40,
  },
  {
    id: current++,
    schedule: 1,
    lessonTaker: 1004, // холопов, муз. литература
    teacher: 7,
    subject: 7,
    weekDay: 4,
    start: 15 * 60,
    end: 15 * 60 + 40,
  },
  {
    id: current++,
    schedule: 1,
    lessonTaker: 2,
    teacher: 4,
    subject: 2,
    weekDay: 1,
    start: 15 * 60,
    end: 16 * 60,
  },
  {
    id: current++,
    schedule: 1,
    lessonTaker: 2,
    teacher: 4,
    subject: 2,
    weekDay: 5,
    start: 10 * 60,
    end: 10 * 60 + 20,
  },
  {
    id: current++,
    schedule: 1,
    lessonTaker: 2,
    teacher: 4,
    subject: 6,
    weekDay: 5,
    start: 10 * 60 + 30,
    end: 11 * 60 + 10,
  },
  {
    id: current++,
    schedule: 1,
    lessonTaker: 2,
    teacher: 8,
    subject: 5,
    weekDay: 4,
    start: 11 * 60,
    end: 11 * 60 + 20,
  },
  {
    id: current++,
    schedule: 1,
    lessonTaker: 2,
    teacher: 7,
    subject: 3,
    weekDay: 2,
    start: 11 * 60,
    end: 12 * 60,
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
