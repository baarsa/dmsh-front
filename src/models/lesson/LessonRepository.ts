import { ILesson } from "../../entities/ILesson";
import { lessonService } from "../../services/lessonService";
import { GenericEntityRepository } from "../shared";
import { LessonEntity, createLessonEntity } from "./LessonEntity";

class LessonRepository extends GenericEntityRepository<LessonEntity, ILesson> {
  getByParameters(parameters: Partial<ILesson>) {
    // todo improve types
    return Object.values(this.entities)
        .filter(entity => Object.entries(parameters).every(([key, value]) => (entity as any)[key] === value));
  }
  constructor() {
    //maybe: as we use only one service/creator per entity type
    super({
      entityService: lessonService,
      createEntity: createLessonEntity
    });
  }
}

export const lessonRepository = new LessonRepository();
