import { GenericEntityRepository } from "../shared";
import { createPupilEntity, PupilEntity } from "./PupilEntity";
import { pupilService } from "../../services/pupilService";
import { IPupil } from "../../entities/IPupil";

class PupilRepository extends GenericEntityRepository<PupilEntity, IPupil> {
  constructor() {
    //maybe: as we use only one service/creator per entity type
    super({
      entityService: pupilService,
      createEntity: createPupilEntity,
    });
  }
}

export const pupilRepository = new PupilRepository();
