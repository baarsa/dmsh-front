import { useEffect, useState } from "react";
import { Form } from "../../../components/Form";
import { ViewSubjectViewModel } from "../../../view-models/pages/catalogs/subjects/ViewSubjectViewModel";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

export const ViewSubject = observer(() => {
  const params = useParams<{ id: string }>();
  const [vm, setVm] = useState<ViewSubjectViewModel | null>(null);
  useEffect(() => {
    if (params.id !== undefined) {
      setVm(new ViewSubjectViewModel(Number(params.id)));
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
