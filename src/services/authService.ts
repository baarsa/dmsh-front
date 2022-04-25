import { api } from "./__api";

export interface IBackendUser {
  name: string;
  roles: number[];
  teacherId: number | null;
}

export interface IAuthService {
  login(username: string, password: string): Promise<IBackendUser | null>;
  logout(): Promise<void>;
  auth(): Promise<IBackendUser | null>;
}

export const authService: IAuthService = {
  async login(username: string, password: string) {
    return (await api.post("login", {
      username,
      password,
    })) as IBackendUser | null;
  },
  async logout() {
    await api.get("logout");
  },
  async auth() {
    return (await api.get("auth")) as IBackendUser | null;
  },
};
