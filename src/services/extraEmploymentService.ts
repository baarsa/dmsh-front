import { IExtraEmployment } from "../entities/IExtraEmployment";
import { IEntityService } from "./shared";

// total fake
let current = 10;
let items = [
  {
    id: current++,
    schedule: 1,
    person: 1,
    description: "Отдых",
    weekDay: 0,
    start: 12.5 * 60,
    end: 15 * 60,
  },
  {
    id: current++,
    schedule: 1,
    person: 50,
    description: "Школа",
    weekDay: 0,
    start: 10 * 60,
    end: 14.5 * 60,
  },
];

export const extraEmploymentService: IEntityService<IExtraEmployment> = {
  async fetchAll() {
    return items;
  },
  async fetchById(_id: number) {
    return items.find(({ id }) => id === _id) ?? null;
  },
  async saveToServer(data: IExtraEmployment) {
    const newItem = {
      id: current++,
      ...data,
    };
    items = [...items, newItem];
    return newItem;
  },
  async update(id: number, data: Partial<IExtraEmployment>) {
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
