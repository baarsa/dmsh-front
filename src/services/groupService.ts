import { IGroup } from "../entities/IGroup";
import { IEntityService } from "./shared";
import { INITIAL_PUPIL_ID, items as pupils } from "./pupilService";
import { items as schedules } from "./scheduleService";

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
  {
    id: current++,
    lessonTakerId: currentLt++,
    name: "Хор, первая группа",
    pupils: pupils
      .filter(
        (pupil) =>
          pupil.program === 1 &&
          [0, 1, 2].includes(schedules[0].pupilsYears[pupil.id])
      )
      .map((pupil) => pupil.id),
  },
  {
    id: current++,
    lessonTakerId: currentLt++,
    name: "Холопов, муз. литература",
    pupils: [INITIAL_PUPIL_ID, INITIAL_PUPIL_ID + 1],
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
