import { IEntityService } from "./shared";
import { ITeacher } from "../entities/ITeacher";

// total fake
let current = 1;
let items = [
  {
    id: current++,
    name: "Пифагор",
    canAssist: true,
    subjects: [1, 2, 3],
  },
  {
    id: current++,
    name: "Аристотель",
    canAssist: false,
    subjects: [2],
  },
];

export const teacherService: IEntityService<ITeacher> = {
  async fetchAll() {
    return items;
  },
  async fetchById(_id: number) {
    return items.find(({ id }) => id === _id) ?? null;
  },
  async saveToServer(data: ITeacher) {
    const newItem = {
      id: current++,
      ...data,
    };
    items = [...items, newItem];
    return newItem;
  },
  async update(id: number, data: ITeacher) {
    items = items.map((teacher) =>
      teacher.id === id ? { ...teacher, ...data } : teacher
    );
    return {
      id,
      ...data,
    };
  },
  async remove(_id: number) {
    items = items.filter(({ id }) => id !== _id);
  },
};
