import { IProgram } from "../../entities/IProgram";
import { Stored } from "../shared";

export class ProgramEntity implements IProgram {
  id: number;
  name: string;
  specialityGroup: number;
  yearPlans: Array<{
    specialityHalfHours: number;
    commonSubjectsHalfHours: Record<number, number>;
  }>;

  constructor(props: Stored<IProgram>) {
    this.id = props.id;
    this.name = props.name;
    this.specialityGroup = props.specialityGroup;
    this.yearPlans = props.yearPlans;
  }
}

export const createProgramEntity = (props: Stored<IProgram>) =>
  new ProgramEntity(props);
