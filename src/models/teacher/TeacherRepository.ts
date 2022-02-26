import { ITeacher } from "../../entities/ITeacher";
import { GenericEntityRepository } from "../shared";
import { createTeacherEntity, TeacherEntity } from "./TeacherEntity";
import { teacherService } from "../../services/teacherService";

class TeacherEntityRepository extends GenericEntityRepository<
  TeacherEntity,
  ITeacher
> {
  constructor() {
    //maybe: as we use only one service/creator per entity type
    super({
      entityService: teacherService,
      createEntity: createTeacherEntity
    });
  }
}

export const teacherEntityRepository = new TeacherEntityRepository();
