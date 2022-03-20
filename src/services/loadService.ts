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
    subject: 3,
  },
  {
    id: current++,
    schedule: 1,
    pupil: 52,
    teacher: 1,
    subject: 1,
  },
  {
    id: current++,
    schedule: 1,
    pupil: 52,
    teacher: 1,
    subject: 4,
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
    const item = items.find(({ id }) => id === _id);
    if (item === undefined) {
      throw new Error();
    }
    return item;
  },
  async saveToServer(data: ILoad) {
    const newItem = {
      id: current++,
      ...data,
    };
    items = [...items, newItem];
    return newItem;
  },
  async update(id: number, data: Partial<ILoad>) {
    items = items.map((item) =>
        item.id === id ? { ...item, ...data } : item
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
