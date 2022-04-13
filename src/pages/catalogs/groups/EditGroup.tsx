import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form } from "../../../components/Form";
import { EditGroupVM } from "../../../view-models/pages/catalogs/groups/EditGroupVM";

export const EditGroup = observer(() => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vm, setVm] = useState<EditGroupVM | null>(null);
  useEffect(() => {
    if (params.id !== undefined) {
      setVm(new EditGroupVM(Number(params.id)));
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
