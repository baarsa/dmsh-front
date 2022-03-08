import {IEntity, Stored} from "../shared";
import {ISchedule} from "../../entities/ISchedule";
import {extraEmploymentRepository} from "../extra-employment/ExtraEmploymentRepository";
import {computed, makeObservable} from "mobx";

export class ScheduleEntity implements IEntity, ISchedule {
    id: number;
    name: string;
    lessons: number[]; // todo remake to getter
    get extraEmployments() {
        return extraEmploymentRepository.getByParameters({ schedule: this.id });
    }

    constructor(props: Stored<ISchedule>) {
        this.id = props.id;
        this.name = props.name;
        this.lessons = props.lessons;
        makeObservable(this, {
            extraEmployments: computed,
        });
    }
}
export const createScheduleEntity = (props: Stored<ISchedule>) =>
    new ScheduleEntity(props);