import { IExtraEmployment } from "../../entities/IExtraEmployment";
import { extraEmploymentService } from "../../services/extraEmploymentService";
import { GenericEntityRepository } from "../shared";
import {
  createExtraEmploymentEntity,
  ExtraEmploymentEntity,
} from "./ExtraEmploymentEntity";

class ExtraEmploymentRepository extends GenericEntityRepository<
  ExtraEmploymentEntity,
  IExtraEmployment
> {
  constructor() {
    //maybe: as we use only one service/creator per entity type
    super({
      entityService: extraEmploymentService,
      createEntity: createExtraEmploymentEntity,
    });
  }

  getByParameters(parameters: Partial<IExtraEmployment>) {
    return Object.values(this.entities).filter((entity) =>
      Object.entries(parameters).every(
        ([key, value]) => (entity as any)[key] === value
      )
    );
  }
}

export const extraEmploymentRepository = new ExtraEmploymentRepository();
