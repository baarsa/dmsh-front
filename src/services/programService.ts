import { Stored } from "../models/shared";
import { IEntityService } from "./shared";
import { IProgram } from "../entities/IProgram";

let current = 1;
let items = [
  {
    id: current++,
    name: "Струнные 8 лет",
    specialityGroup: 1,
    yearPlans: [
      {
        specialityHalfHours: 4,
        commonSubjectsHalfHours: {
          4: 2,
          3: 2,
          7: 2,
        },
      },
      {
        specialityHalfHours: 4,
        commonSubjectsHalfHours: {
          4: 2,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 4,
        commonSubjectsHalfHours: {
          5: 2,
          4: 2,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 4,
        commonSubjectsHalfHours: {
          6: 2,
          5: 2,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 5,
        commonSubjectsHalfHours: {
          6: 2,
          5: 2,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 5,
        commonSubjectsHalfHours: {
          6: 2,
          5: 2,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 5,
        commonSubjectsHalfHours: {
          6: 2,
          5: 2,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 5,
        commonSubjectsHalfHours: {
          6: 2,
          5: 2,
          3: 3,
          7: 3,
        },
      },
    ],
  },
  {
    id: current++,
    name: "Духовые и ударные 5 лет",
    specialityGroup: 2,
    yearPlans: [
      {
        specialityHalfHours: 4,
        commonSubjectsHalfHours: {
          4: 2,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 4,
        commonSubjectsHalfHours: {
          6: 2,
          5: 1,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 4,
        commonSubjectsHalfHours: {
          6: 2,
          5: 1,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 5,
        commonSubjectsHalfHours: {
          6: 2,
          5: 1,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 5,
        commonSubjectsHalfHours: {
          6: 2,
          5: 2,
          3: 3,
          7: 3,
        },
      },
    ],
  },
  {
    id: current++,
    name: "Духовые и ударные 8 лет",
    specialityGroup: 2,
    yearPlans: [
      {
        specialityHalfHours: 4,
        commonSubjectsHalfHours: {
          4: 2,
          3: 2,
          7: 2,
        },
      },
      {
        specialityHalfHours: 4,
        commonSubjectsHalfHours: {
          4: 2,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 4,
        commonSubjectsHalfHours: {
          4: 2,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 4,
        commonSubjectsHalfHours: {
          6: 2,
          5: 1,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 4,
        commonSubjectsHalfHours: {
          6: 2,
          5: 1,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 4,
        commonSubjectsHalfHours: {
          6: 2,
          5: 1,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 5,
        commonSubjectsHalfHours: {
          6: 2,
          5: 1,
          3: 3,
          7: 2,
        },
      },
      {
        specialityHalfHours: 5,
        commonSubjectsHalfHours: {
          6: 2,
          5: 2,
          3: 3,
          7: 3,
        },
      },
    ],
  },
] as Array<Stored<IProgram>>;

export const programService: IEntityService<IProgram> = {
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
  async saveToServer(data: IProgram) {
    const newItem = {
      id: current++,
      ...data,
    };
    items = [...items, newItem];
    return newItem;
  },
  async update(id: number, data: Partial<IProgram>) {
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
