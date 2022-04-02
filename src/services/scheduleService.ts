// total fake
import { IEntityService } from "./shared";
import { ISchedule } from "../entities/ISchedule";
import { Stored } from "../models/shared";
import { INITIAL_PUPIL_ID, PUPILS_NUMBER } from "./pupilService";

let current = 1;
let items = [
  {
    id: current++,
    name: "2022",
    pupilsYears: (() => {
      let years: Record<number, number> = {};
      for (
        let i = INITIAL_PUPIL_ID;
        i < INITIAL_PUPIL_ID + PUPILS_NUMBER;
        i++
      ) {
        years[i] = Math.floor(Math.random() * 5);
      }
      return years;
    })(),
  },
  {
    id: current++,
    name: "2023",
    pupilsYears: {
      50: 1,
      51: 1,
      52: 2,
    },
  },
] as Array<Stored<ISchedule>>;

export const scheduleService: IEntityService<ISchedule> = {
  async fetchAll() {
    return items;
  },
  async fetchById(_id: number) {
    const item = items.find(({ id }) => id === _id);
    if (item === undefined) {
      throw new Error();
    }
    return item;
  },
  async saveToServer(data: ISchedule) {
    const newItem = {
      id: current++,
      ...data,
    };
    items = [...items, newItem];
    return newItem;
  },
  async update(id: number, data: Partial<ISchedule>) {
    items = items.map((teacher) =>
      teacher.id === id ? { ...teacher, ...data } : teacher
    );
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
