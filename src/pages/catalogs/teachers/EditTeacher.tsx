import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form } from "../../../components/forms/form/Form";
import { EditTeacherVM } from "../../../view-models/pages/catalogs/teachers/EditTeacherVM";

export const EditTeacher = observer(() => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vm, setVm] = useState<EditTeacherVM | null>(null);
  useEffect(() => {
    if (params.id !== undefined) {
      setVm(new EditTeacherVM(Number(params.id)));
    }
  }, [params]);
  if (vm === null || vm.form === null) {
    return null; // todo loader
  }
  return (
    <div>
      <Form
        form={vm.form}
        onSubmit={() => {
          navigate(`../${params.id}`);
        }}
        onCancel={() => {
          navigate(`../${params.id}`);
        }}
      />
    </div>
  );
});
