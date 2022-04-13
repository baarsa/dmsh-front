import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ViewScheduleVM } from "../../../view-models/pages/catalogs/schedules/ViewScheduleVM";
import { ScheduleForm } from "../../../components/forms/schedule-form/ScheduleForm";

export const ViewSchedule = observer(() => {
  const params = useParams<{ id: string }>();
  const [vm, setVm] = useState<ViewScheduleVM | null>(null);
  useEffect(() => {
    if (params.id !== undefined) {
      setVm(new ViewScheduleVM(Number(params.id)));
    }
  }, [params]);
  if (vm === null || vm.form === null) {
    return null; // todo loader
  }
  return <ScheduleForm vm={vm.form} />;
});
