import {
  filterItemsForUser,
  navigationItems,
  NavigationVM,
} from "../NavigationVM";
import { autorun, makeAutoObservable } from "mobx";
import { IAuthStore } from "../../models/auth-store/IAuthStore";
import { IConfigStore } from "../../models/config-store/IConfigStore";

export class MainViewModel {
  get isAuth(): boolean {
    return this._authStore.user !== null;
  }

  get navigation(): NavigationVM | null {
    return this._navigation;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }
  private _navigation: NavigationVM | null = null;
  private _isLoading = true;
  private _authStore: IAuthStore;
  private _configStore: IConfigStore;

  constructor(authStore: IAuthStore, configStore: IConfigStore) {
    this._authStore = authStore;
    this._configStore = configStore;
    autorun(() => {
      if (!this._authStore.isLoading) {
        const currentUser = this._authStore.user;
        if (currentUser !== null) {
          this._navigation = new NavigationVM(
            filterItemsForUser(navigationItems, currentUser)
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
