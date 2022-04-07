import { useState } from "react";
import { CreateSubjectViewModel } from "../view-models/pages/subjects/CreateSubjectViewModel";
import { Form } from "../components/Form";
import { useNavigate } from "react-router-dom";

export const CreateSubject = () => {
  const [viewModel] = useState(() => new CreateSubjectViewModel());
  const navigate = useNavigate();
  return (
    <div>
      <Form
        form={viewModel.form}
        onSubmit={(id) => {
          navigate(`../${id}`);
        }}
        onCancel={() => {
          navigate("..");
        }}
      />
    </div>
  );
};
