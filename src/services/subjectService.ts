import { ISubject } from "../entities/ISubject";
import { IEntityService } from "./shared";

let current = 1;
let items = [
  {
    id: current++,
    name: "Violin",
    isSpecial: true,
    specialityGroup: 1,
  },
  {
    id: current++,
    name: "Flute",
    isSpecial: true,
    specialityGroup: 2,
  },
  {
    id: current++,
    name: "Solfeggio",
    isSpecial: false,
    specialityGroup: null,
  },
];

// total fake
export const subjectService: IEntityService<ISubject> = {
  async fetchAll() {
    return items;
  },
  async fetchById(_id: number) {
    return items.find(({ id }) => id === _id) ?? null;
  },
  async saveToServer(data: ISubject) {
    const newItem = {
      id: current++,
      ...data
    };
    items = [...items, newItem];
    return newItem;
  },
  async update(id: number, data: ISubject) {
    items = items.map((teacher) => teacher.id === id ? { ...teacher, ...data } : teacher);
    return {
      id,
      ...data
    };
  },
  async remove(_id: number) {
    items = items.filter(({ id }) => id !== _id);
  }
};
