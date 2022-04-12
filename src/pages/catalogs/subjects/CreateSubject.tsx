import { useState } from "react";
import { CreateSubjectViewModel } from "../../../view-models/pages/catalogs/subjects/CreateSubjectViewModel";
import { Form } from "../../../components/Form";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

export const CreateSubject = observer(() => {
  const [vm] = useState(() => new CreateSubjectViewModel());
  const navigate = useNavigate();
  if (vm.form === null) {
    return null; // todo loader
  }
  return (
    <div>
      <Form
        form={vm.form}
        onSubmit={(id) => {
          navigate(`../${id}`);
        }}
        onCancel={() => {
          navigate("..");
        }}
      />
    </div>
  );
});
