import {Permission} from "../rolesAndPermissions";

export interface IUser {
    name: string;
    teacherId: number | null; // если есть роль Преподаватель, то у пользователя должна быть связь с конкретным преподавателем
    hasPermission(permission: Permission): boolean;
}
