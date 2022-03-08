import { IEntityService } from "./shared";
import {IPupil} from "../entities/IPupil";

// total fake
let current = 50;
let currentLt = 1;
let items = [
  {
    id: current++,
    lessonTakerId: currentLt++,
    name: "Luke Skywalker",
    specialSubject: 1, //violin
    program: 1,
  },
  {
    id: current++,
    lessonTakerId: currentLt++,
    name: "Han Solo",
    specialSubject: 2, //flute
    program: 3,
  },
  {
    id: current++,
    lessonTakerId: currentLt++,
    name: "Leia Organ",
    specialSubject: 1, //violin
    program: 2,
  },
];

export const pupilService: IEntityService<IPupil> = {
  async fetchAll() {
    return items;
  },
  async fetchById(_id: number) {
    return items.find(({ id }) => id === _id) ?? null;
  },
  async saveToServer(data: IPupil) {
    const newItem = {
      id: current++,
      lessonTakerId: currentLt++,
      ...data
    };
    items = [...items, newItem];
    return newItem;
  },
  async update(id: number, data: IPupil) {
    items = items.map((teacher) => teacher.id === id ? { ...teacher, ...data } : teacher);
    return {
      id,
      lessonTakerId: currentLt++,
      ...data
    };
  },
  async remove(_id: number) {
    items = items.filter(({ id }) => id !== _id);
  }
};
