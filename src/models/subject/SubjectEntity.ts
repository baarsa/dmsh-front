import { ISubject } from "../../entities/ISubject";
import { Stored } from "../shared";

export class SubjectEntity {
  id: number;
  name: string;
  isSpecial: boolean;
  specialityGroup: number | null;

  constructor(props: Stored<ISubject>) {
    this.id = props.id;
    this.name = props.name;
    this.isSpecial = props.isSpecial;
    this.specialityGroup = props.specialityGroup;
  }
}
export const createSubjectEntity = (props: Stored<ISubject>) =>
  new SubjectEntity(props);
