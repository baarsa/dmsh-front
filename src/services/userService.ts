import { IEntityService } from "./shared";
import { IUser } from "../entities/IUser";

let current = 1;
let items = [
  {
    id: current++,
    name: "Агафонов Николай Алексеевич",
    login: "agafonov",
    password: "abcdef",
    roles: [1],
    teacherId: 1,
  },
  {
    id: current++,
    name: "Уранова Анна",
    login: "uranova",
    password: "123456",
    roles: [2],
    teacherId: null,
  },
  {
    id: current++,
    name: "Шолохов Николай",
    login: "sholohov",
    password: "666666",
    roles: [0],
    teacherId: null,
  },
];

export const userService: IEntityService<IUser> = {
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
  async saveToServer(data: IUser) {
    const newItem = {
      id: current++,
      ...data,
    };
    items = [...items, newItem];
    return newItem;
  },
  async update(id: number, data: Partial<IUser>) {
    items = items.map((user) => (user.id === id ? { ...user, ...data } : user));
    const item = items.find((item) => item.id === id);
    if (item === undefined) {
      throw new Error();
    }
    return {
      ...item,
      ...data,
    };
  },
  async remove(_id: number) {
    items = items.filter(({ id }) => id !== _id);
  },
};
