import { createContext, useContext } from "react";
import { scheduleContextStore } from "./ScheduleContextStore";

const scheduleStoreContext = createContext(scheduleContextStore);

export const useScheduleStore = () => useContext(scheduleStoreContext);
