import { useState } from "react";
import { TimeManagement } from "../components/TimeManagement";
import { groupRepository } from "../models/group/GroupRepository";
import { pupilEntityRepository } from "../models/pupil/PupilRepository";
import { teacherEntityRepository } from "../models/teacher/TeacherRepository";
import { LinkFieldVM } from "../view-models/fields/LinkField";
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
  const [vm] = useState(() => {
    const teacherField = new LinkFieldVM(
      { label: "Преподаватель" },
      teacherEntityRepository
    ); // todo disabled? initial value?
    const pupilField = new LinkFieldVM(
      { label: "Учащийся" },
      pupilEntityRepository, // standarize repositories names (remove "entity")
      (pupil) => true // TODO length of loads for (schedule, selectedTeacher, pupil) > 0
    );
    const groupField = new LinkFieldVM(
      { label: "Группа" },
      groupRepository,
      (group) => true // TODO length of loads for (schedule, selectedTeacher, pupil) > 0 for every pupil of group
    );
    return new TimeManagementVM({
      canChangeTeacher: true, //derive from context
      teacherField,
      pupilField,
      groupField
    });
  });
  return (
    <div>
      <TimeManagement vm={vm} />
    </div>
  );
};
