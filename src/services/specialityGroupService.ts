import { IEntityService } from "./shared";
import { ISpecialityGroup } from "../entities/ISpecialityGroup";

let current = 1;
let items = [
  {
    id: current++,
    name: "Струнные",
  },
  {
    id: current++,
    name: "Духовые",
  },
];

export const specialityGroupService: IEntityService<ISpecialityGroup> = {
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
  async saveToServer(data: ISpecialityGroup) {
    const newItem = {
      id: current++,
      ...data,
    };
    items = [...items, newItem];
    return newItem;
  },
  async update(id: number, data: Partial<ISpecialityGroup>) {
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
