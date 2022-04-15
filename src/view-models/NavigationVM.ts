import { Permission } from "../models/rolesAndPermissions";
import { IUser } from "../models/user/IUser";
import { IScheduleContextStore } from "../models/schedule-context-store/IScheduleContextStore";
import { makeAutoObservable } from "mobx";

type NavigationItemDescription = {
  text: string;
  url: string;
  permission: Permission | null;
  children?: NavigationItemDescription[];
  needActiveSchedule?: boolean;
};

export type DisplayNavigationItemDescription = {
  text: string;
  url: string;
  children?: DisplayNavigationItemDescription[];
  isDisabled: boolean;
};

const navigationItems = [
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
        text: "Учащиеся",
        url: "/pupils",
        permission: null,
      },
      {
        text: "Группы",
        url: "/groups",
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
    needActiveSchedule: true,
  },
  {
    text: "Распределение нагрузки",
    url: "/loads",
    permission: Permission.LoadsPage,
    needActiveSchedule: true,
  },
  {
    text: "Администрирование",
    url: "/admin",
    permission: Permission.AdminPage,
  },
];

const mapItems = (
  items: NavigationItemDescription[],
  user: IUser,
  hasActiveSchedule: boolean
): DisplayNavigationItemDescription[] => {
  return items
    .filter((item) => user.hasPermission(item.permission))
    .map((item) => {
      const mappedItem = {
        text: item.text,
        url: item.url,
        isDisabled: item.needActiveSchedule === true && !hasActiveSchedule,
      };
      return item.children === undefined
        ? mappedItem
        : {
            ...mappedItem,
            children: mapItems(item.children, user, hasActiveSchedule),
          };
    })
    .filter(
      (item) =>
        !("children" in item) ||
        item.children === undefined ||
        item.children.length > 1
    );
};

export class NavigationVM {
  get items(): DisplayNavigationItemDescription[] {
    return mapItems(
      this._items,
      this._user,
      this._scheduleStore.currentSchedule !== null
    );
  }
  private readonly _items: NavigationItemDescription[] = navigationItems;
  private readonly _scheduleStore: IScheduleContextStore;
  private readonly _user: IUser;

  constructor(scheduleStore: IScheduleContextStore, user: IUser) {
    this._scheduleStore = scheduleStore;
    this._user = user;
    makeAutoObservable(this);
  }
}
