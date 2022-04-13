import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "../../../components/Form";
import { CreatePupilVM } from "../../../view-models/pages/catalogs/pupils/CreatePupilVM";

export const CreatePupil = observer(() => {
  const [vm] = useState(() => new CreatePupilVM());
  const navigate = useNavigate();
  if (vm.form === null) {
    return null; // todo loader
  }
  return (
    <Form
      form={vm.form}
      onSubmit={(id) => {
        navigate(`../${id}`);
      }}
      onCancel={() => {
        navigate("..");
      }}
    />
  );
});
