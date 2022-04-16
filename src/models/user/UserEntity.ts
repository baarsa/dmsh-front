import { Stored } from "../shared";
import { IUser } from "../../entities/IUser";
import { Permission, Role, rolesPermissions } from "../rolesAndPermissions";

export class UserEntity implements IUser {
  id: number;
  name: string;
  login: string;
  password: string;
  roles: Role[];
  teacherId: number | null;

  hasPermission(permission: Permission) {
    return (
      permission === null ||
      this.roles.some((role) => rolesPermissions[role].includes(permission))
    );
  }

  constructor(props: Stored<IUser>) {
    this.id = props.id;
    this.name = props.name;
    this.login = props.login;
    this.password = props.password;
    this.roles = props.roles;
    this.teacherId = props.teacherId;
  }
}
export const createUserEntity = (props: Stored<IUser>) => new UserEntity(props);
