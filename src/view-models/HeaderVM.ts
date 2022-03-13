import { NavigationVM } from "./NavigationVM";

export class HeaderVM {
  get navigation() {
    return this._navigation;
  }

  get userName() {
    return "Ковалев Николай Сергеевич"; // TODO get from auth store
  }

  private readonly _navigation: NavigationVM;

  constructor(navigation: NavigationVM) {
    this._navigation = navigation;
  }
}
