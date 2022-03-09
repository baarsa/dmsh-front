import { IGroup } from "../../entities/IGroup";
import { IEntity, Stored } from "../shared";

export class GroupEntity implements IEntity, IGroup {
  id: number;
  lessonTakerId: number;
  name: string;
  pupils: number[];

  constructor(props: Stored<IGroup>) {
    this.id = props.id;
    this.lessonTakerId = props.lessonTakerId;
    this.name = props.name;
    this.pupils = props.pupils;
  }
}
export const createGroupEntity = (props: Stored<IGroup>) =>
  new GroupEntity(props);
