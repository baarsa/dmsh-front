import { createContext, useContext } from "react";
import { configStore } from "./ConfigStore";

const configStoreContext = createContext(configStore);

export const useConfigStore = () => useContext(configStoreContext);
