import { IEntity, Stored } from "../shared";
import { IPupil } from "../../entities/IPupil";

export class PupilEntity implements IEntity, IPupil {
  id: number;
  lessonTakerId: number;
  name: string;
  specialSubject: number;
  program: number;

  constructor(props: Stored<IPupil>) {
    this.id = props.id;
    this.lessonTakerId = props.lessonTakerId;
    this.name = props.name;
    this.specialSubject = props.specialSubject;
    this.program = props.program;
  }
}
export const createPupilEntity = (props: Stored<IPupil>) =>
  new PupilEntity(props);
