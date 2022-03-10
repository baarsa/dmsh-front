
export interface IBackendUser {
    name: string;
    roles: number[];
    teacherId: number | null;
}

export interface IAuthService {
    login(username: string, password: string): Promise<IBackendUser | null>;
    auth(): Promise<IBackendUser | null>; // with cookie
}

// fake
const user = {
    name: 'Admin A. Admin',
    roles: [0,1,2],
    teacherId: 1,
}

export const authService: IAuthService = {
    login(username: string, password: string) {
        return new Promise(res => {
            setTimeout(() => {
                res(user);
            }, 3000);
        });
    },
    auth() {
        return new Promise(res => {
            setTimeout(() => {
                res(user);
            }, 500);
        });
    }
}