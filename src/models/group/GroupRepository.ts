import { IGroup } from "../../entities/IGroup";
import { GenericEntityRepository } from "../shared";
import { GroupEntity, createGroupEntity } from "./GroupEntity";
import { groupService } from "../../services/groupService";

class GroupRepository extends GenericEntityRepository<GroupEntity, IGroup> {
  constructor() {
    //maybe: as we use only one service/creator per entity type
    super({
      entityService: groupService,
      createEntity: createGroupEntity
    });
  }
}

export const groupRepository = new GroupRepository();
