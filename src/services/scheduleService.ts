
// total fake
import {IEntityService} from "./shared";
import {ISchedule} from "../entities/ISchedule";

let current = 1;
let items = [
    {
        id: current++,
        name: "2022",
        lessons: [1, 2],
    },
    {
        id: current++,
        name: "2023",
        lessons: [20],
    },
];

export const scheduleService: IEntityService<ISchedule> = {
    async fetchAll() {
        return items;
    },
    async fetchById(_id: number) {
        return items.find(({ id }) => id === _id) ?? null;
    },
    async saveToServer(data: ISchedule) {
        const newItem = {
            id: current++,
            ...data
        };
        items = [...items, newItem];
        return newItem;
    },
    async update(id: number, data: ISchedule) {
        items = items.map((teacher) => teacher.id === id ? { ...teacher, ...data } : teacher);
        return {
            id,
            ...data
        };
    },
    async remove(_id: number) {
        items = items.filter(({ id }) => id !== _id);
    }
};
