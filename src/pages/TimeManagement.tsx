import { useEffect, useState } from "react";
import { TimeManagement } from "../components/time-management/TimeManagement";
import { groupRepository } from "../models/group/GroupRepository";
import { pupilEntityRepository } from "../models/pupil/PupilRepository";
import { teacherEntityRepository } from "../models/teacher/TeacherRepository";
import { LinkFieldVM } from "../view-models/fields/LinkField";
import { TimeManagementVM } from "../view-models/pages/TimeManagementViewModel";
import { scheduleRepository } from "../models/schedule/ScheduleRepository";

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
      const teacherField = new LinkFieldVM(
        { label: "Преподаватель" },
        teacherEntityRepository
      ); // todo disabled? initial value?
      const pupilField = new LinkFieldVM(
        { label: "Учащийся" },
        pupilEntityRepository, // standardize repositories names (remove "entity")
        (pupil) => true // TODO length of loads for (schedule, selectedTeacher, pupil) > 0
      );
      const groupField = new LinkFieldVM(
        { label: "Группа" },
        groupRepository,
        (group) => true // TODO length of loads for (schedule, selectedTeacher, pupil) > 0 for every pupil of group
      );
      const schedule = await scheduleRepository.getEntityById(1);
      if (schedule === null) {
        throw new Error(); // todo think about it
      }
      setVm(
        new TimeManagementVM({
          canChangeTeacher: true, //derive from context
          teacherField,
          pupilField,
          groupField,
          schedule,
        })
      );
    }
    init();
  }, []);
  if (vm === null) {
    return null; //todo loader
  }
  return (
    <div>
      <TimeManagement vm={vm} />
    </div>
  );
};
