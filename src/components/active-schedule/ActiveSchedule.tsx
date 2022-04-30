import { ActiveScheduleVM } from "../../view-models/ActiveScheduleVM";
import { LinkField } from "../fields/link-field/LinkField";

type Props = {
  vm: ActiveScheduleVM;
};

export const ActiveSchedule = ({ vm }: Props) => {
  return (
    <div style={{ width: "280px" }}>
      <LinkField field={vm.scheduleField} />
    </div>
  );
};
