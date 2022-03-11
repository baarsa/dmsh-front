import {NoAccess} from "./NoAccess/NoAccess";
import React from "react";
import {Permission} from "../models/rolesAndPermissions";
import {useAuthStore} from "../models/auth-store/use-auth-store";

export function withPermission <TProps>(permission: Permission, Component: React.JSXElementConstructor<TProps>) {
    return function WithPermission(props: TProps) {
        const authStore = useAuthStore();
        if (authStore.user === null || !authStore.user.hasPermission(permission)) {
            return <NoAccess />;
        }
        return <Component {...props} />;
    }
}