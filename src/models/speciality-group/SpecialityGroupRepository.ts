import { GenericEntityRepository } from "../shared";
import {
  createSpecialityGroupEntity,
  SpecialityGroupEntity,
} from "./SpecialityGroupEntity";
import { ISpecialityGroup } from "../../entities/ISpecialityGroup";
import { specialityGroupService } from "../../services/specialityGroupService";

export class SpecialityGroupRepository extends GenericEntityRepository<
  SpecialityGroupEntity,
  ISpecialityGroup
> {
  constructor() {
    //maybe: as we use only one service/creator per entity type
    super({
      entityService: specialityGroupService,
      createEntity: createSpecialityGroupEntity,
    });
  }
}

export const specialityGroupRepository = new SpecialityGroupRepository();
