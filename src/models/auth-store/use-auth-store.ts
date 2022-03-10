import {createContext, useContext} from "react";
import {authStore} from "./AuthStore";

const authStoreContext = createContext(authStore);

export const useAuthStore = () => useContext(authStoreContext);