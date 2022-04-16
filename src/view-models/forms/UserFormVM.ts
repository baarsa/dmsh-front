import { FormModel, IFormModel } from "./FormModel";
import { UserEntity } from "../../models/user/UserEntity";
import { IUser } from "../../entities/IUser";
import { Role, rolesNames } from "../../models/rolesAndPermissions";
import { LinkFieldVM } from "../fields/LinkField";
import { TeacherEntity } from "../../models/teacher/TeacherEntity";
import { teacherRepository } from "../../models/teacher/TeacherRepository";
import { autorun, makeAutoObservable } from "mobx";

type Parameters = {
  basicForm: FormModel<{ name: string; login: string; password: string }>;
  user?: UserEntity;
  submitHandler?: (data: IUser) => Promise<number>;
  cancelHandler?: () => void;
};

export class UserFormVM implements IFormModel {
  get teacherField(): LinkFieldVM<TeacherEntity> | null {
    return this._teacherField;
  }
  get mode() {
    return this._basicForm.mode;
  }

  get title() {
    return this._basicForm.title;
  }

  getFields() {
    return this._basicForm.getFields();
  }

  isValid() {
    return (
      this._basicForm.isValid() &&
      this._selectedRoles.length > 0 &&
      !(
        this._selectedRoles.includes(Role.Teacher) &&
        this._teacherField?.value === null
      )
    );
  }

  get rolesOptions() {
    return [
      { value: Role.Admin, text: rolesNames[Role.Admin] },
      { value: Role.Teacher, text: rolesNames[Role.Teacher] },
      { value: Role.Deputy, text: rolesNames[Role.Deputy] },
    ];
  }

  get selectedRoles(): number[] {
    return this._selectedRoles;
  }

  set selectedRoles(values) {
    this._selectedRoles = values;
  }

  get isTeacherFieldVisible() {
    return this._selectedRoles.includes(Role.Teacher);
  }

  async handleSubmit() {
    const basicFields = this._basicForm.mappedFields;
    if (this._submitHandler === undefined) {
      throw new Error("Обработчик формы не определен");
    }
    return this._submitHandler({
      ...basicFields,
      roles: this._selectedRoles,
      teacherId: this._teacherField?.value?.id ?? null,
    });
  }

  handleCancel() {
    if (this._cancelHandler !== undefined) {
      this._cancelHandler();
    }
  }

  private _basicForm: FormModel<{
    name: string;
    login: string;
    password: string;
  }>;
  private _selectedRoles: Role[] = [];
  private _teacherField: LinkFieldVM<TeacherEntity> | null = null;
  private readonly _submitHandler?: (data: IUser) => Promise<number>;
  private readonly _cancelHandler?: () => void;

  private async _init(user?: UserEntity) {
    if (user !== undefined) {
      this._selectedRoles = user.roles;
    }
    const teacher =
      user === undefined || user.teacherId === null
        ? null
        : await teacherRepository.getEntityById(user?.teacherId);
    this._teacherField = new LinkFieldVM<TeacherEntity>(
      {
        label: "Преподаватель",
      },
      {
        entityModel: teacherRepository,
        hasEmptyValueOption: true,
        initialValues: teacher === null ? [] : [teacher],
      }
    );
  }

  constructor({ basicForm, user, submitHandler, cancelHandler }: Parameters) {
    this._basicForm = basicForm;
    this._submitHandler = submitHandler;
    this._cancelHandler = cancelHandler;
    makeAutoObservable(this);
    autorun(() => {
      if (
        !this._selectedRoles.includes(Role.Teacher) &&
        this._teacherField !== null
      ) {
        this._teacherField.setValues([]);
      }
    });
    void this._init(user);
  }
}
