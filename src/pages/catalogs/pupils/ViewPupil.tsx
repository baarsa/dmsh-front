import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form } from "../../../components/Form";
import { ViewPupilVM } from "../../../view-models/pages/catalogs/pupils/ViewPupilVM";

export const ViewPupil = observer(() => {
  const params = useParams<{ id: string }>();
  const [vm, setVm] = useState<ViewPupilVM | null>(null);
  useEffect(() => {
    if (params.id !== undefined) {
      setVm(new ViewPupilVM(Number(params.id)));
    }
  }, [params]);
  if (vm === null || vm.form === null) {
    return null; // todo loader
  }
  return <Form form={vm.form} />;
});
