import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form } from "../../../components/forms/form/Form";
import { ViewTeacherVM } from "../../../view-models/pages/catalogs/teachers/ViewTeacherVM";

export const ViewTeacher = observer(() => {
  const params = useParams<{ id: string }>();
  const [vm, setVm] = useState<ViewTeacherVM | null>(null);
  useEffect(() => {
    if (params.id !== undefined) {
      setVm(new ViewTeacherVM(Number(params.id)));
    }
  }, [params]);
  if (vm === null || vm.form === null) {
    return null; // todo loader
  }
  return (
    <div>
      <Form form={vm.form} />
    </div>
  );
});
