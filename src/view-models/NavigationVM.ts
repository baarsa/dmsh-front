import { Permission } from "../models/rolesAndPermissions";
import { IUser } from "../models/user/IUser";

export type NavigationItemDescription = {
  text: string;
  url: string;
  permission: Permission | null;
  children?: NavigationItemDescription[];
};

export const navigationItems = [
  {
    text: "Справочники",
    url: "/catalogs",
    permission: null,
    children: [
      {
        text: "Преподаватели",
        url: "/teachers",
        permission: null,
      },
      {
        text: "Предметы",
        url: "/subjects",
        permission: null,
      },
      {
        text: "Программы",
        url: "/programs",
        permission: null,
      },
      {
        text: "Расписания",
        url: "/schedules",
        permission: null,
      },
    ],
  },
  {
    text: "Составление расписания",
    url: "/time-management",
    permission: Permission.TimeManagementPage,
  },
  {
    text: "Распределение нагрузки",
    url: "/loads",
    permission: Permission.LoadsPage,
  },
  {
    text: "Администрирование",
    url: "/admin",
    permission: Permission.AdminPage,
  },
];

export const filterItemsForUser = (
  items: NavigationItemDescription[],
  user: IUser
): NavigationItemDescription[] => {
  return items
    .filter((item) => user.hasPermission(item.permission))
    .map((item) =>
      item.children === undefined
        ? item
        : {
            ...item,
            children: filterItemsForUser(item.children, user),
          }
    )
    .filter((item) => item.children === undefined || item.children.length > 1);
};

export class NavigationVM {
  get items(): NavigationItemDescription[] {
    return this._items;
  }
  private readonly _items: NavigationItemDescription[];

  constructor(items: NavigationItemDescription[]) {
    this._items = items;
  }
}
