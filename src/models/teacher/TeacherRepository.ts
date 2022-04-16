import { ITeacher } from "../../entities/ITeacher";
import { GenericEntityRepository } from "../shared";
import { createTeacherEntity, TeacherEntity } from "./TeacherEntity";
import { teacherService } from "../../services/teacherService";

class TeacherRepository extends GenericEntityRepository<
  TeacherEntity,
  ITeacher
> {
  constructor() {
    //maybe: as we use only one service/creator per entity type
    super({
      entityService: teacherService,
      createEntity: createTeacherEntity,
    });
  }
}

export const teacherRepository = new TeacherRepository();
