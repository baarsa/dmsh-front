import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ViewUserVM } from "../../view-models/pages/admin/ViewUserVM";
import { UserForm } from "../../components/forms/user-form/UserForm";

export const ViewUser = observer(() => {
  const params = useParams<{ id: string }>();
  const [vm, setVm] = useState<ViewUserVM | null>(null);
  useEffect(() => {
    if (params.id !== undefined) {
      setVm(new ViewUserVM(Number(params.id)));
    }
  }, [params]);
  if (vm === null || vm.form === null) {
    return null; // todo loader
  }
  return <UserForm vm={vm.form} />;
});
