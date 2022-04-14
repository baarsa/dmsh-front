import { useEffect, useState } from "react";
import { TimeManagement } from "../components/time-management/TimeManagement";
import { TimeManagementVM } from "../view-models/pages/TimeManagementViewModel";

export const TimeManagementPage = () => {
  // create VM
  // context:
  // 1. role, user and permissions: canChangeTeacher, currentTeacher
  // 2. current schedule: available pupils for every teacher (via schedule's loads);
  //     saving lessons/employments (to this schedule).
  // updating filtering function for pupils/groups link field:
  // 1) pass function with dependency on current teacher once (mobx will take care?)
  // 2) method in LinkFieldVM for updating filter
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
    return null; //todo loader
  }
  return <TimeManagement vm={vm} />;
};
