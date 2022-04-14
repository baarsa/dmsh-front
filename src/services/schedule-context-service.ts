export interface IScheduleContextService {
  getCurrentScheduleId: () => Promise<number | null>;
  setCurrentScheduleId: (id: number | null) => Promise<void>;
}

const STORAGE_ID = "current_schedule";

export const scheduleContextService: IScheduleContextService = {
  async getCurrentScheduleId() {
    const item = localStorage.getItem(STORAGE_ID);
    return item === null ? null : Number(item);
  },
  async setCurrentScheduleId(id) {
    if (id === null) {
      localStorage.removeItem(STORAGE_ID);
    } else {
      localStorage.setItem(STORAGE_ID, String(id));
    }
  },
};
