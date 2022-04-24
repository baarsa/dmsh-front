import { ScheduleEntity } from "../schedule/ScheduleEntity";

export interface IScheduleContextStore {
  currentSchedule: ScheduleEntity | null;
  isLoading: boolean;
}
