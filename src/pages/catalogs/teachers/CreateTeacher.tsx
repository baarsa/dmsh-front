import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "../../../components/Form";
import { CreateTeacherVM } from "../../../view-models/pages/teachers/CreateTeacherVM";

export const CreateTeacher = observer(() => {
  const [vm] = useState(() => new CreateTeacherVM());
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
