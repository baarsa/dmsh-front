import { GenericEntityRepository } from "../shared";
import { createScheduleEntity, ScheduleEntity } from "./ScheduleEntity";
import { ISchedule } from "../../entities/ISchedule";
import { ScheduleService, scheduleService } from "../../services/scheduleService";

class ScheduleRepository extends GenericEntityRepository<
  ScheduleEntity,
  ISchedule
> {
  protected _entityService: ScheduleService;
  async copy(originalId: number, newName: string, nextYear: boolean) {
    const response = await this._entityService.copy(originalId, newName, nextYear);
    this._entities = {
      ...this.entities,
      [response.id]: this.createEntity(response),
    };
  }

  constructor() {
    super({
      entityService: scheduleService,
      createEntity: createScheduleEntity,
    });
    this._entityService = scheduleService;
  }
}

export const scheduleRepository = new ScheduleRepository();
