import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form } from "../../../components/Form";
import { EditPupilVM } from "../../../view-models/pages/catalogs/pupils/EditPupilVM";

export const EditPupil = observer(() => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vm, setVm] = useState<EditPupilVM | null>(null);
  useEffect(() => {
    if (params.id !== undefined) {
      setVm(new EditPupilVM(Number(params.id)));
    }
  }, [params]);
  if (vm === null || vm.form === null) {
    return null; // todo loader
  }
  return (
    <Form
      form={vm.form}
      onSubmit={() => {
        navigate(`../${params.id}`);
      }}
      onCancel={() => {
        navigate(`../${params.id}`);
      }}
    />
  );
});
