import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { EditProgramVM } from "../../../view-models/pages/catalogs/programs/EditProgramVM";
import { ProgramForm } from "../../../components/forms/ProgramForm";

export const EditProgram = observer(() => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vm, setVm] = useState<EditProgramVM | null>(null);
  useEffect(() => {
    if (params.id !== undefined) {
      setVm(new EditProgramVM(Number(params.id)));
    }
  }, [params]);
  if (vm === null || vm.form === null) {
    return null; // todo loader
  }
  return (
    <ProgramForm
      vm={vm.form}
      onSubmit={() => {
        navigate(`../${params.id}`);
      }}
      onCancel={() => {
        navigate(`../${params.id}`);
      }}
    />
  );
});
