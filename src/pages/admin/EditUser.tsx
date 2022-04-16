import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { EditUserVM } from "../../view-models/pages/admin/EditUserVM";
import { UserForm } from "../../components/forms/user-form/UserForm";

export const EditUser = observer(() => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vm, setVm] = useState<EditUserVM | null>(null);
  useEffect(() => {
    if (params.id !== undefined) {
      setVm(new EditUserVM(Number(params.id)));
    }
  }, [params]);
  if (vm === null || vm.form === null) {
    return null; // todo loader
  }
  return (
    <UserForm
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
