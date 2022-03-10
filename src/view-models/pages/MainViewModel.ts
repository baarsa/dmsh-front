import {navigationItems, NavigationVM} from "../NavigationVM";
import {autorun, makeAutoObservable} from "mobx";
import { IAuthStore } from "../../models/auth-store/IAuthStore";

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

    constructor(authStore: IAuthStore) {
        this._authStore = authStore;
        autorun(() => {
            if (!this._authStore.isLoading) {
                const currentUser = this._authStore.user;
                if (currentUser !== null) {
                    this._navigation = new NavigationVM(navigationItems.filter(item => currentUser.hasPermission(item.permission)));
                }
                this._isLoading = false;
            }
        });
        makeAutoObservable(this);
    }
}