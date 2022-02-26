import { useState } from "react";
import { CreateSubjectViewModel } from "../view-models/pages/CreateSubjectViewModel";
import { Form } from "../components/Form";

export const CreateSubject = () => {
  const [viewModel] = useState(() => new CreateSubjectViewModel());
  return (
    <div>
      <Form form={viewModel.form} />
    </div>
  );
};
