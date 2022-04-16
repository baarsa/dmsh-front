import { FormMode, FormModel } from "../../forms/FormModel";
import { StringFieldVM } from "../../fields/StringField";
import { UserEntity } from "../../../models/user/UserEntity";
import { userRepository } from "../../../models/user/UserRepository";
import { UserFormVM } from "../../forms/UserFormVM";
import { IUser } from "../../../entities/IUser";

type UserFormParameters = {
  mode: FormMode;
  userId?: number;
};

export class UserFormBuilder {
  static async buildForm({ mode, userId }: UserFormParameters) {
    let user: UserEntity | null = null;
    if (userId !== undefined) {
      user = await userRepository.getEntityById(userId);
      if (user === null) {
        throw new Error("Не найден пользователь");
      }
    }
    const basicForm = new FormModel<{
      name: string;
      login: string;
      password: string;
    }>({
      title:
        user === null ? "Создание пользователя" : `Пользователь "${user.name}"`,
      mode,
      fields: {
        name:
          user === null
            ? new StringFieldVM({ label: "ФИО" })
            : new StringFieldVM({ label: "ФИО" }, user.name),
        login:
          user === null
            ? new StringFieldVM({ label: "Логин" })
            : new StringFieldVM({ label: "Логин" }, user.login),
        password:
          user === null
            ? new StringFieldVM({ label: "Пароль" })
            : new StringFieldVM({ label: "Пароль" }, user.password),
      },
      mapFieldsToProps: (fields) => ({
        name: fields.name.value,
        login: fields.login.value,
        password: fields.password.value,
      }),
    });
    return new UserFormVM({
      basicForm,
      user: user ?? undefined,
      submitHandler:
        mode === "view"
          ? undefined
          : async (data: IUser) => {
              return userId === undefined
                ? userRepository.addEntity(data)
                : userRepository.updateEntity(userId, data);
            },
    });
  }
}
