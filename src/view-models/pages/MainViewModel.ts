import { NavigationVM } from "../NavigationVM";
import { autorun, makeAutoObservable } from "mobx";
import { IAuthStore } from "../../models/auth-store/IAuthStore";
import { IConfigStore } from "../../models/config-store/IConfigStore";
import { HeaderVM } from "../HeaderVM";
import { ActiveScheduleVM } from "../ActiveScheduleVM";
import { IScheduleContextStore } from "../../models/schedule-context-store/IScheduleContextStore";

type Parameters = {
  authStore: IAuthStore;
  configStore: IConfigStore;
  scheduleContextStore: IScheduleContextStore;
};

export class MainViewModel {
  get isAuth(): boolean {
    return this._authStore.user !== null;
  }

  get header(): HeaderVM | null {
    return this._header;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }
  private _header: HeaderVM | null = null;
  private _isLoading = true;
  private _authStore: IAuthStore;
  private _configStore: IConfigStore;
  private _scheduleContextStore: IScheduleContextStore;

  constructor({ authStore, configStore, scheduleContextStore }: Parameters) {
    this._authStore = authStore;
    this._configStore = configStore;
    this._scheduleContextStore = scheduleContextStore;
    autorun(() => {
      if (!this._authStore.isLoading && this._header === null) {
        const currentUser = this._authStore.user;
        if (currentUser !== null) {
          this._header = new HeaderVM(
            new NavigationVM(scheduleContextStore, currentUser),
            new ActiveScheduleVM(scheduleContextStore)
          );
        }
      }
    });
    autorun(() => {
      if (!this._authStore.isLoading && !this._configStore.isLoading) {
        this._isLoading = false;
      }
    });
    makeAutoObservable(this);
  }
}
