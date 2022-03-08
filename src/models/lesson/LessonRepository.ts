import { ILesson } from "../../entities/ILesson";
import { lessonService } from "../../services/lessonService";
import { GenericEntityRepository } from "../shared";
import { LessonEntity, createLessonEntity } from "./LessonEntity";

class LessonRepository extends GenericEntityRepository<LessonEntity, ILesson> {
  // async getBy(params: Partial<ILesson>) {
  //   const allEntities = await this.getAllEntities();
  //   // todo improve types
  //   return Object.values(allEntities)
  //       .filter(entity => Object.entries(params).every(([key, value]) => (entity as any)[key] === value));
  // }
  constructor() {
    //maybe: as we use only one service/creator per entity type
    super({
      entityService: lessonService,
      createEntity: createLessonEntity
    });
  }
}

export const lessonRepository = new LessonRepository();
