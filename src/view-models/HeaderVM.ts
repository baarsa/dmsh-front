import { NavigationVM } from "./NavigationVM";
import { ActiveScheduleVM } from "./ActiveScheduleVM";

export class HeaderVM {
  get activeSchedule(): ActiveScheduleVM {
    return this._activeSchedule;
  }
  get navigation() {
    return this._navigation;
  }

  get userName() {
    return "пользователь"; // TODO get from auth store
  }

  private readonly _navigation: NavigationVM;
  private readonly _activeSchedule: ActiveScheduleVM;

  constructor(navigation: NavigationVM, activeSchedule: ActiveScheduleVM) {
    this._navigation = navigation;
    this._activeSchedule = activeSchedule;
  }
}
