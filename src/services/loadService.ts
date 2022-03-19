import { IEntityService } from "./shared";
import { ILoad } from "../entities/ILoad";

let current = 1;
let items = [
  {
    id: current++,
    schedule: 1,
    pupil: 50,
    teacher: 1,
    subject: 1,
  },
  {
    id: current++,
    schedule: 1,
    pupil: 50,
    teacher: 1,
    subject: 2,
  },
  {
    id: current++,
    schedule: 1,
    pupil: 50,
    teacher: 2,
    subject: 3,
  },
];

// total fake
export const loadService: IEntityService<ILoad> = {
  async fetchAll() {
    return items;
  },
  async fetchById(_id: number) {
    return items.find(({ id }) => id === _id) ?? null;
  },
  async saveToServer(data: ILoad) {
    const newItem = {
      id: current++,
      ...data,
    };
    items = [...items, newItem];
    return newItem;
  },
  async update(id: number, data: ILoad) {
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
