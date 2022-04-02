import { IGroup } from "../entities/IGroup";
import { IEntityService } from "./shared";
import { items as pupils } from "./pupilService";

// total fake
let current = 1;
let currentLt = 1000;
export let items = [
  {
    id: current++,
    lessonTakerId: currentLt++,
    name: "Первый класс",
    pupils: [50, 51, 52],
  },
  {
    id: current++,
    lessonTakerId: currentLt++,
    name: "Второй класс",
    pupils: [51, 52],
  },
  {
    id: current++,
    lessonTakerId: currentLt++,
    name: "Струнные, первый класс",
    pupils: pupils
      .filter((pupil) => pupil.program === 1)
      .map((pupil) => pupil.id),
  },
];

export const groupService: IEntityService<IGroup> = {
  async fetchAll() {
    return items;
  },
  async fetchById(_id: number) {
    return items.find(({ id }) => id === _id) ?? null;
  },
  async saveToServer(data: IGroup) {
    const newItem = {
      id: current++,
      lessonTakerId: currentLt++,
      ...data,
    };
    items = [...items, newItem];
    return newItem;
  },
  async update(id: number, data: IGroup) {
    items = items.map((item) => (item.id === id ? { ...item, ...data } : item));
    return {
      id,
      lessonTakerId: currentLt++,
      ...data,
    };
  },
  async remove(_id: number) {
    items = items.filter(({ id }) => id !== _id);
  },
};
