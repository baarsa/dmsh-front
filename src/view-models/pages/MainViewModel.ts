import {
  filterItemsForUser,
  navigationItems,
  NavigationVM,
} from "../NavigationVM";
import { autorun, makeAutoObservable } from "mobx";
import { IAuthStore } from "../../models/auth-store/IAuthStore";
import { IConfigStore } from "../../models/config-store/IConfigStore";
import { HeaderVM } from "../HeaderVM";

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

  constructor(authStore: IAuthStore, configStore: IConfigStore) {
    this._authStore = authStore;
    this._configStore = configStore;
    autorun(() => {
      if (!this._authStore.isLoading) {
        const currentUser = this._authStore.user;
        if (currentUser !== null) {
          this._header = new HeaderVM(
            new NavigationVM(filterItemsForUser(navigationItems, currentUser))
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
