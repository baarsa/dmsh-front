import { items as users } from "./userService";

export interface IBackendUser {
  name: string;
  roles: number[];
  teacherId: number | null;
}

export interface IAuthService {
  login(username: string, password: string): Promise<IBackendUser | null>;
  logout(): Promise<void>;
  auth(): Promise<IBackendUser | null>; // with cookie
}

// fake
const user = {
  name: "Admin A. Admin",
  roles: [0, 1, 2],
  teacherId: 1,
};

export const authService: IAuthService = {
  login(username: string, password: string) {
    return new Promise((res) => {
      setTimeout(() => {
        const user = users.find(
          (u) => u.login === username && u.password === password
        );
        res(user ?? null);
      }, 1000);
    });
  },
  logout() {
    return new Promise((res) => {
      setTimeout(() => {
        // remove cookie
        res();
      }, 1000);
    });
  },
  auth() {
    return new Promise((res) => {
      // send request with cookie/token
      setTimeout(() => {
        res(user);
      }, 500);
    });
  },
};
