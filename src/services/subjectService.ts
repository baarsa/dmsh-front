import { ISubject } from "../entities/ISubject";
import { IEntityService } from "./shared";

let current = 1;
let items = [
  {
    id: current++,
    name: "Скрипка",
    isSpecial: true,
    specialityGroup: 1,
  },
  {
    id: current++,
    name: "Флейта",
    isSpecial: true,
    specialityGroup: 2,
  },
  {
    id: current++,//3
    name: "Сольфеджио",
    isSpecial: false,
    specialityGroup: null,
  },
  {
    id: current++,
    name: "Хор",
    isSpecial: false,
    specialityGroup: null,
  },
  {
    id: current++,//5
    name: "Общее фортепиано",
    isSpecial: false,
    specialityGroup: null,
  },
  {
    id: current++,
    name: "Ансамбль",
    isSpecial: false,
    specialityGroup: null,
  },
  {
    id: current++,//7
    name: "Музыкальная литература",
    isSpecial: false,
    specialityGroup: null,
  },
  {
    id: current++,
    name: "Виолончель",
    isSpecial: true,
    specialityGroup: 1,
  },
  {
    id: current++,//9
    name: "Кларнет",
    isSpecial: true,
    specialityGroup: 2,
  },
];

// total fake
export const subjectService: IEntityService<ISubject> = {
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
  async saveToServer(data: ISubject) {
    const newItem = {
      id: current++,
      ...data,
    };
    items = [...items, newItem];
    return newItem;
  },
  async update(id: number, data: Partial<ISubject>) {
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
