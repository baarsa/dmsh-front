import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateScheduleVM } from "../../../view-models/pages/catalogs/schedules/CreateScheduleVM";
import { ScheduleForm } from "../../../components/forms/schedule-form/ScheduleForm";

export const CreateSchedule = observer(() => {
  const [vm] = useState(() => new CreateScheduleVM());
  const navigate = useNavigate();
  if (vm.form === null) {
    return null; // todo loader
  }
  return (
    <ScheduleForm
      vm={vm.form}
      onSubmit={(id) => {
        navigate(`../${id}`);
      }}
      onCancel={() => {
        navigate("..");
      }}
    />
  );
});
