import { IEntityService } from "./shared";
import { ILoad } from "../entities/ILoad";
import { items as groups } from "./groupService";
import {INITIAL_PUPIL_ID} from "./pupilService";

let current = 1;
let items = [
  {
    id: current++,
    schedule: 1,
    pupil: INITIAL_PUPIL_ID,
    teacher: 1,
    subject: 1,
  },
  {
    id: current++,
    schedule: 1,
    pupil: INITIAL_PUPIL_ID,
    teacher: 1,
    subject: 3,
  },
  {
    id: current++,
    schedule: 1,
    pupil: INITIAL_PUPIL_ID,
    teacher: 7,
    subject: 7,
  },////
  {
    id: current++,
    schedule: 1,
    pupil: INITIAL_PUPIL_ID + 1,
    teacher: 4,
    subject: 2,
  },
  {
    id: current++,
    schedule: 1,
    pupil: INITIAL_PUPIL_ID + 1,
    teacher: 4,
    subject: 6,
  },
  {
    id: current++,
    schedule: 1,
    pupil: INITIAL_PUPIL_ID + 1,
    teacher: 8,
    subject: 5,
  },
  {
    id: current++,
    schedule: 1,
    pupil: INITIAL_PUPIL_ID + 1,
    teacher: 7,
    subject: 3,
  },
  {
    id: current++,
    schedule: 1,
    pupil: INITIAL_PUPIL_ID + 1,
    teacher: 7,
    subject: 7,
  },
];

for (let pupil of groups[3].pupils) {
  items.push({
    id: current++,
    schedule: 1,
    pupil,
    teacher: 6,
    subject: 4,
  });
}

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
