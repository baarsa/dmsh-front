import { ISubject } from "../../entities/ISubject";
import { subjectService } from "../../services/subjectService";
import { GenericEntityRepository } from "../shared";
import { SubjectEntity, createSubjectEntity } from "./SubjectEntity";

class SubjectEntityRepository extends GenericEntityRepository<
  SubjectEntity,
  ISubject
> {
  constructor() {
    //maybe: as we use only one service/creator per entity type
    super({
      entityService: subjectService,
      createEntity: createSubjectEntity
    });
  }
}

export const subjectEntityRepository = new SubjectEntityRepository();

// maybe export only instantiated object? or as a singleton?
