import { StringFieldVM } from "../fields/StringField";
import { authStore } from "../../models/auth-store/AuthStore";
import { makeAutoObservable } from "mobx";
import { addError } from "../../notifications";

export class LoginVM {
  get loginField(): StringFieldVM {
    return this._loginField;
  }

  get passwordField(): StringFieldVM {
    return this._passwordField;
  }

  get isSubmitDisabled() {
    return !(this._loginField.isValid() && this._passwordField.isValid());
  }

  private _loginField = new StringFieldVM({ label: "Логин" });
  private _passwordField = new StringFieldVM({ label: "Пароль" });

  async handleSubmit() {
    const login = this._loginField.value;
    const password = this._passwordField.value;
    const success = await authStore.login(login, password);
    if (!success) {
      this._loginField.value = "";
      this._passwordField.value = "";
      addError("Неверный логин/пароль");
    }
    return success;
  }

  constructor() {
    makeAutoObservable(this);
  }
}
