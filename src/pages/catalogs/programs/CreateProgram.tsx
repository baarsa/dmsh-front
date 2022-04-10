import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateProgramVM } from "../../../view-models/pages/programs/CreateProgramVM";
import { ProgramForm } from "../../../components/forms/ProgramForm";

export const CreateProgram = observer(() => {
  const [vm] = useState(() => new CreateProgramVM());
  const navigate = useNavigate();
  if (vm.form === null) {
    return null; // todo loader
  }
  return (
    <ProgramForm
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
