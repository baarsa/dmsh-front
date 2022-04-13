import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { EditScheduleVM } from "../../../view-models/pages/catalogs/schedules/EditScheduleVM";
import { ScheduleForm } from "../../../components/forms/schedule-form/ScheduleForm";

export const EditSchedule = observer(() => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vm, setVm] = useState<EditScheduleVM | null>(null);
  useEffect(() => {
    if (params.id !== undefined) {
      setVm(new EditScheduleVM(Number(params.id)));
    }
  }, [params]);
  if (vm === null || vm.form === null) {
    return null; // todo loader
  }
  return (
    <ScheduleForm
      vm={vm.form}
      onSubmit={() => {
        navigate(`../${params.id}`);
      }}
      onCancel={() => {
        navigate(`../${params.id}`);
      }}
    />
  );
});
