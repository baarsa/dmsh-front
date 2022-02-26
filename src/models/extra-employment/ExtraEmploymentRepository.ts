import { IExtraEmployment } from "../../entities/IExtraEmployment";
import { extraEmploymentService } from "../../services/extraEmploymentService";
import { GenericEntityRepository } from "../shared";
import {
  createExtraEmploymentEntity,
  ExtraEmploymentEntity
} from "./ExtraEmploymentEntity";

class ExtraEmploymentRepository extends GenericEntityRepository<
  ExtraEmploymentEntity,
  IExtraEmployment
> {
  constructor() {
    //maybe: as we use only one service/creator per entity type
    super({
      entityService: extraEmploymentService,
      createEntity: createExtraEmploymentEntity
    });
  }
}

export const extraEmploymentRepository = new ExtraEmploymentRepository();
