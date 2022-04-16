import { authService, IAuthService } from "../../services/authService";
import { makeAutoObservable } from "mobx";
import { IAuthStore } from "./IAuthStore";
import { IUser } from "../user/IUser";
import { User } from "../user/User";

class AuthStore implements IAuthStore {
  get user(): IUser | null {
    return this._user;
  }
  get isLoading(): boolean {
    return this._isLoading;
  }
  async login(username: string, password: string) {
    this._isLoading = true;
    const result = await this._authService.login(username, password);
    this._isLoading = false;
    if (result !== null) {
      this._user = new User(result);
      return true;
    }
    return false;
  }

  async logout() {
    return this._authService.logout();
  }

  private _isLoading = true;
  private _user: IUser | null = null;
  private _authService: IAuthService;

  private async _init() {
    const result = await this._authService.auth();
    if (result !== null) {
      this._user = new User(result);
    }
    this._isLoading = false;
  }

  constructor(authService: IAuthService) {
    this._authService = authService;
    void this._init();
    makeAutoObservable(this);
  }
}
export const authStore = new AuthStore(authService);
