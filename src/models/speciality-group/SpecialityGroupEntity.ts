import { Stored } from "../shared";
import { ISpecialityGroup } from "../../entities/ISpecialityGroup";

export class SpecialityGroupEntity {
  id: number;
  name: string;

  constructor(props: Stored<ISpecialityGroup>) {
    this.id = props.id;
    this.name = props.name;
  }
}

export const createSpecialityGroupEntity = (props: Stored<ISpecialityGroup>) =>
  new SpecialityGroupEntity(props);
