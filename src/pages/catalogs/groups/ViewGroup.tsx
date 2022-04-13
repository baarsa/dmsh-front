import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form } from "../../../components/Form";
import { ViewGroupVM } from "../../../view-models/pages/catalogs/groups/ViewGroupVM";

export const ViewGroup = observer(() => {
  const params = useParams<{ id: string }>();
  const [vm, setVm] = useState<ViewGroupVM | null>(null);
  useEffect(() => {
    if (params.id !== undefined) {
      setVm(new ViewGroupVM(Number(params.id)));
    }
  }, [params]);
  if (vm === null || vm.form === null) {
    return null; // todo loader
  }
  return <Form form={vm.form} />;
});
