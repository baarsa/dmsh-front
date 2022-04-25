import { NavigationVM } from "./NavigationVM";
import { ActiveScheduleVM } from "./ActiveScheduleVM";
import { authStore } from "../models/auth-store/AuthStore";
import { makeAutoObservable } from "mobx";

export class HeaderVM {
  get activeSchedule(): ActiveScheduleVM {
    return this._activeSchedule;
  }
  get navigation() {
    return this._navigation;
  }

  get userName() {
    return authStore.user?.name;
  }

  get isLoading() {
    return this._activeSchedule.isLoading;
  }

  async handleLogout() {
    return authStore.logout();
  }

  private readonly _navigation: NavigationVM;
  private readonly _activeSchedule: ActiveScheduleVM;

  constructor(navigation: NavigationVM, activeSchedule: ActiveScheduleVM) {
    this._navigation = navigation;
    this._activeSchedule = activeSchedule;
    makeAutoObservable(this);
  }
}
