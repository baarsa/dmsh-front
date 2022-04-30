import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "../../../components/forms/form/Form";
import { CreateGroupVM } from "../../../view-models/pages/catalogs/groups/CreateGroupVM";

export const CreateGroup = observer(() => {
  const [vm] = useState(() => new CreateGroupVM());
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
