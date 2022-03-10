import {Permission, Role, rolesPermissions} from "../rolesAndPermissions";
import {IBackendUser} from "../../services/authService";

export class User {
    get name(): string {
        return this._name;
    }

    get teacherId(): number | null {
        return this._teacherId;
    }

    hasPermission(permission: Permission) {
        return permission === null
            || this._roles.some(role => rolesPermissions[role].includes(permission));
    }
    private readonly _name: string;
    private _roles: Role[];
    private readonly _teacherId: number | null;

    constructor(userData: IBackendUser) {
        this._name = userData.name;
        this._roles = userData.roles;
        this._teacherId = userData.teacherId;
    }
}
