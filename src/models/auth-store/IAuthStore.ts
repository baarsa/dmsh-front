import {IUser} from "../user/IUser";

export interface IAuthStore {
    login(username: string, password: string): Promise<boolean>;
    isLoading: boolean;
    user: IUser | null;
}