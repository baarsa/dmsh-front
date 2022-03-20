import {Stored} from "../models/shared";
import {IEntityService} from "./shared";
import {IProgram} from "../entities/IProgram";

let current = 1;
let items = [
    {
        id: current++,
        name: "Струнные 2 года",
        specialityGroup: 1,
        yearPlans: [
            {
                specialityHalfHours: 4,
                commonSubjectsHalfHours: {
                    4: 2,
                    3: 2,
                    7: 2,
                }
            },
            {
                specialityHalfHours: 5,
                commonSubjectsHalfHours: {
                    4: 2,
                    5: 2,
                    3: 3,
                    7: 2,
                }
            }
        ]
    },
    {
        id: current++,
        name: "Духовые 2 года",
        specialityGroup: 2,
        yearPlans: [
            {
                specialityHalfHours: 3,
                commonSubjectsHalfHours: {
                    4: 3,
                    3: 3,
                    7: 3,
                }
            },
            {
                specialityHalfHours: 4,
                commonSubjectsHalfHours: {
                    4: 2,
                    5: 2,
                    3: 3,
                    7: 2,
                }
            }
        ]
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
        items = items.map((item) =>
            item.id === id ? { ...item, ...data } : item
        );
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