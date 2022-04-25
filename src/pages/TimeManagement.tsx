import { useEffect, useState } from "react";
import { TimeManagement } from "../components/time-management/TimeManagement";
import { TimeManagementVM } from "../view-models/pages/TimeManagementViewModel";

export const TimeManagementPage = () => {
  const [vm, setVm] = useState<TimeManagementVM | null>(null);
  useEffect(() => {
    async function init() {
      const canChangeTeacher = true; // TODO set from context
      setVm(
        new TimeManagementVM({
          canChangeTeacher,
        })
      );
    }
    init();
  }, []);
  if (vm === null) {
    return null;
  }
  return <TimeManagement vm={vm} />;
};
