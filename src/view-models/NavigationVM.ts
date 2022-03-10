import { Permission } from "../models/rolesAndPermissions";

type NavigationItem = {
    text: string;
    url: string;
    permission: Permission | null;
}

export const navigationItems = [
    {
        text: 'Составление расписания',
        url: '/time-management',
        permission: Permission.TimeManagementPage,
    },
    {
        text: 'Распределение нагрузки',
        url: '/loads',
        permission: Permission.LoadsPage,
    },
    {
        text: 'Администрирование',
        url: '/admin',
        permission: Permission.AdminPage,
    },
]

export class NavigationVM {
    get items(): NavigationItem[] {
        return this._items;
    }
    private readonly _items: NavigationItem[];

    constructor(items: NavigationItem[]) {
        this._items = items;
    }
}