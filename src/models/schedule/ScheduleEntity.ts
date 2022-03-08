import {IEntity, Stored} from "../shared";
import {ISchedule} from "../../entities/ISchedule";
import {extraEmploymentRepository} from "../extra-employment/ExtraEmploymentRepository";
import {computed, makeObservable} from "mobx";
import { lessonRepository } from "../lesson/LessonRepository";

export class ScheduleEntity implements IEntity, ISchedule {
    id: number;
    name: string;
    get lessons() {
        return lessonRepository.getByParameters({ schedule: this.id });
    }
    get extraEmployments() {
        return extraEmploymentRepository.getByParameters({ schedule: this.id });
    }

    constructor(props: Stored<ISchedule>) {
        this.id = props.id;
        this.name = props.name;
        makeObservable(this, {
            extraEmployments: computed,
        });
    }
}
export const createScheduleEntity = (props: Stored<ISchedule>) =>
    new ScheduleEntity(props);