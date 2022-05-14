import { ILesson } from "../../entities/ILesson";
import {LessonService, lessonService} from "../../services/lessonService";
import { GenericEntityRepository } from "../shared";
import { LessonEntity, createLessonEntity } from "./LessonEntity";

class LessonRepository extends GenericEntityRepository<LessonEntity, ILesson> {
  protected _entityService: LessonService;
  getByParameters(parameters: Partial<ILesson>) {
    // todo improve types
    return Object.values(this.entities).filter((entity) =>
      Object.entries(parameters).every(
        ([key, value]) => (entity as any)[key] === value
      )
    );
  }
  async deleteAssistance(idLesson: number) {
    const response = await this._entityService.deleteAssistance(idLesson);
    this._entities[idLesson] = this.createEntity(response);
  }
  constructor() {
    //maybe: as we use only one service/creator per entity type
    super({
      entityService: lessonService,
      createEntity: createLessonEntity,
    });
    this._entityService = lessonService;
  }
}

export const lessonRepository = new LessonRepository();
