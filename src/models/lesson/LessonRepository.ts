import { ILesson } from "../../entities/ILesson";
import { lessonService } from "../../services/lessonService";
import { GenericEntityRepository } from "../shared";
import { LessonEntity, createLessonEntity } from "./LessonEntity";

class LessonRepository extends GenericEntityRepository<LessonEntity, ILesson> {
  constructor() {
    //maybe: as we use only one service/creator per entity type
    super({
      entityService: lessonService,
      createEntity: createLessonEntity
    });
  }
}

export const lessonEntityRepository = new LessonRepository();
