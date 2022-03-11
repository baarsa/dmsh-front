import { GenericEntityRepository } from "../shared";
import { createScheduleEntity, ScheduleEntity } from "./ScheduleEntity";
import { ISchedule } from "../../entities/ISchedule";
import { scheduleService } from "../../services/scheduleService";

class ScheduleRepository extends GenericEntityRepository<
  ScheduleEntity,
  ISchedule
> {
  constructor() {
    //maybe: as we use only one service/creator per entity type
    super({
      entityService: scheduleService,
      createEntity: createScheduleEntity,
    });
  }
}

export const scheduleRepository = new ScheduleRepository();
