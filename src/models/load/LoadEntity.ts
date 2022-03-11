import { Stored } from "../shared";
import { ILoad } from "../../entities/ILoad";

export class LoadEntity implements ILoad {
  id: number;
  schedule: number;
  pupil: number;
  teacher: number;
  subject: number;

  constructor(props: Stored<ILoad>) {
    this.id = props.id;
    this.schedule = props.schedule;
    this.pupil = props.pupil;
    this.teacher = props.teacher;
    this.subject = props.subject;
  }
}
export const createLoadEntity = (props: Stored<ILoad>) => new LoadEntity(props);
