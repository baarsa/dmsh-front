import { useEffect, useState } from "react";
import { Form } from "../../../components/Form";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { EditSubjectViewModel } from "../../../view-models/pages/subjects/EditSubjectViewModel";

export const EditSubject = observer(() => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vm, setVm] = useState<EditSubjectViewModel | null>(null);
  useEffect(() => {
    if (params.id !== undefined) {
      setVm(new EditSubjectViewModel(Number(params.id)));
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
