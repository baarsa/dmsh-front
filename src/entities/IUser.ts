import { Role } from "../models/rolesAndPermissions";

export type IUser = {
  name: string;
  login: string;
  password: string;
  roles: Role[];
  teacherId: number | null;
};
