import { IEntityService } from "./shared";
import { ITeacher } from "../entities/ITeacher";

// total fake
let current = 1;
let items = [
  {
    id: current++,
    name: "Агафонов Николай Алексеевич",
    canAssist: true,
    subjects: [1, 8, 3, 6],// скрипка, виолончель, сольфеджио
  },
  {
    id: current++,
    name: "Баранов Константин Викторович",
    canAssist: false,
    subjects: [1, 6],// скрипка
  },
  {
    id: current++,
    name: "Круглова Софья Андреевна",
    canAssist: false,
    subjects: [8, 6],// виолончель
  },
  {
    id: current++,
    name: "Соколов Максим Максимович",
    canAssist: false,
    subjects: [2, 6],// флейта
  },
  {
    id: current++,
    name: "Ильина Елена Викторовна",
    canAssist: false,
    subjects: [9, 6],// кларнет
  },
  {
    id: current++,
    name: "Чесноков Андрей Тихонович",
    canAssist: false,
    subjects: [4],// хор
  },
  {
    id: current++, //7
    name: "Холопов Юрий Николаевич",
    canAssist: false,
    subjects: [3, 7],// сольфеджио, муз. литература
  },
  {
    id: current++, //8
    name: "Драгунов Петр Афанасьевич",
    canAssist: false,
    subjects: [5],// общ. фортепиано
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
