import { observer } from "mobx-react-lite";
import { TimeManagementVM } from "../view-models/pages/TimeManagementViewModel";
import { LinkField } from "./fields/LinkField";

export const TimeManagement = observer((props: { vm: TimeManagementVM }) => {
  return (
    <div>
      <select
        value={props.vm.selectedDay}
        onChange={(e) => props.vm.handleDayChange(Number(e.target.value))}
      >
        {props.vm.dayOptions.map((option) => (
          <option value={option.value}>{option.text}</option>
        ))}
      </select>
      <LinkField field={props.vm.teacherField} />
    </div>
  );
});
