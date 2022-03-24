import { IEntityService } from "./shared";
import { ITeacher } from "../entities/ITeacher";

// total fake
let current = 1;
let items = [
  {
    id: current++,
    name: "Паганини",
    canAssist: true,
    subjects: [1, 8, 3],
  },
  {
    id: current++,
    name: "Виотти",
    canAssist: false,
    subjects: [1],
  },
  {
    id: current++,
    name: "Ростропович",
    canAssist: false,
    subjects: [8],
  },
  {
    id: current++,
    name: "Джеймс Голуэй",
    canAssist: false,
    subjects: [2],
  },
  {
    id: current++,
    name: "Бенни Гудмен",
    canAssist: false,
    subjects: [9],
  },
  {
    id: current++,
    name: "Мясковский",
    canAssist: false,
    subjects: [4],
  },
  {
    id: current++,
    name: "Юрий Николаевич Холопов",
    canAssist: false,
    subjects: [3, 7],
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
