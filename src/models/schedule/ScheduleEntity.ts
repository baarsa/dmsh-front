import { Stored } from "../shared";
import { ISchedule } from "../../entities/ISchedule";
import { extraEmploymentRepository } from "../extra-employment/ExtraEmploymentRepository";
import { computed, makeObservable } from "mobx";
import { lessonRepository } from "../lesson/LessonRepository";
import { loadRepository } from "../load/LoadRepository";

export class ScheduleEntity implements ISchedule {
  id: number;
  name: string;
  pupilsYears: Record<number, number>;

  get lessons() {
    return lessonRepository.getByParameters({ schedule: this.id });
  }
  get extraEmployments() {
    return extraEmploymentRepository.getByParameters({ schedule: this.id });
  }
  get loads() {
    return loadRepository.getByParameters({ schedule: this.id });
  }

  constructor(props: Stored<ISchedule>) {
    this.id = props.id;
    this.name = props.name;
    this.pupilsYears = props.pupilsYears;
    makeObservable(this, {
      extraEmployments: computed, // TODO: other properties?
    });
  }
}
export const createScheduleEntity = (props: Stored<ISchedule>) =>
  new ScheduleEntity(props);
