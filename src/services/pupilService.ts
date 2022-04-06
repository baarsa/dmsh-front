import { IEntityService } from "./shared";
import { IPupil } from "../entities/IPupil";
import { names } from "./__names";
import { Stored } from "../models/shared";

export const INITIAL_PUPIL_ID = 50;

// total fake
let current = INITIAL_PUPIL_ID;
let currentLt = 1;
export let items: Array<Stored<IPupil>> = [
  {
    id: current++,
    lessonTakerId: currentLt++,
    name: "Андреев Владимир Николаевич",
    program: 1,
    specialSubject: 1,
  },
  {
    id: current++,
    lessonTakerId: currentLt++,
    name: "Светличная Анна Тимофеевна",
    program: 2,
    specialSubject: 2,
  },
];

export const PUPILS_NUMBER = 100;

for (let i = 0; i < PUPILS_NUMBER; i++) {
  const program = Math.ceil(Math.random() * 3);
  const subjIndex = Math.floor(Math.random() * 2);
  const specialSubject = program === 1 ? [1, 8][subjIndex] : [2, 9][subjIndex];
  items.push({
    id: current++,
    lessonTakerId: currentLt++,
    name: names[i],
    program,
    specialSubject,
  });
}

export const pupilService: IEntityService<IPupil> = {
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
  async saveToServer(data: IPupil) {
    const newItem = {
      id: current++,
      lessonTakerId: currentLt++,
      ...data,
    };
    items = [...items, newItem];
    return newItem;
  },
  async update(id: number, data: IPupil) {
    items = items.map((teacher) =>
      teacher.id === id ? { ...teacher, ...data } : teacher
    );
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
