import { Stored } from "../shared";
import { ITeacher } from "../../entities/ITeacher";

export class TeacherEntity implements ITeacher {
  id: number;
  name: string;
  canAssist: boolean;
  subjects: number[];

  constructor(props: Stored<ITeacher>) {
    this.id = props.id;
    this.name = props.name;
    this.canAssist = props.canAssist;
    this.subjects = props.subjects;
  }
}
export const createTeacherEntity = (props: Stored<ITeacher>) =>
  new TeacherEntity(props);
