export enum Permission {
  AdminPage,
  TimeManagementPage,
  LoadsPage,
  Catalogs,
}

export enum Role {
  Admin,
  Teacher,
  Deputy,
}

export const rolesNames: Record<Role, string> = {
  [Role.Admin]: "Администратор",
  [Role.Teacher]: "Преподаватель",
  [Role.Deputy]: "Завуч",
};

export const rolesPermissions: Record<Role, Permission[]> = {
  [Role.Admin]: [Permission.AdminPage, Permission.Catalogs],
  [Role.Teacher]: [Permission.TimeManagementPage],
  [Role.Deputy]: [
    Permission.LoadsPage,
    Permission.TimeManagementPage,
    Permission.Catalogs,
  ],
};
