import { IExtraEmployment } from "../entities/IExtraEmployment";
import { IEntityService } from "./shared";

// total fake
let current = 10;
let items = [
  {
    id: current++,
    schedule: 1,
    person: 1,
    description: "Shopping",
    weekDay: 0,
    start: 11 * 60,
    end: 15 * 60,
  },
  {
    id: current++,
    schedule: 1,
    person: 2,
    description: "party",
    weekDay: 0,
    start: 14 * 60,
    end: 17.5 * 60,
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
  async update(id: number, data: IExtraEmployment) {
    items = items.map((item) => (item.id === id ? { ...item, ...data } : item));
    return {
      id,
      ...data,
    };
  },
  async remove(_id: number) {
    items = items.filter(({ id }) => id !== _id);
  },
};
