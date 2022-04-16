import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateUserVM } from "../../view-models/pages/admin/CreateUserVM";
import { UserForm } from "../../components/forms/user-form/UserForm";

export const CreateUser = observer(() => {
  const [vm] = useState(() => new CreateUserVM());
  const navigate = useNavigate();
  if (vm.form === null) {
    return null; // todo loader
  }
  return (
    <UserForm
      vm={vm.form}
      onSubmit={(id) => {
        navigate(`../${id}`);
      }}
      onCancel={() => {
        navigate("..");
      }}
    />
  );
});
