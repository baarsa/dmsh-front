import { IExtraEmployment } from "../../entities/IExtraEmployment";
import { Stored } from "../shared";

export class ExtraEmploymentEntity implements IExtraEmployment {
  id: number;
  schedule: number;
  weekDay: number;
  start: number;
  end: number;
  person: number;
  description: string;

  constructor(props: Stored<IExtraEmployment>) {
    this.id = props.id;
    this.schedule = props.schedule;
    this.weekDay = props.weekDay;
    this.start = props.start;
    this.end = props.end;
    this.person = props.person;
    this.description = props.description;
  }
}
export const createExtraEmploymentEntity = (props: Stored<IExtraEmployment>) =>
  new ExtraEmploymentEntity(props);
