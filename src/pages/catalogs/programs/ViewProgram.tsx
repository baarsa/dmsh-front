import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ViewProgramVM } from "../../../view-models/pages/catalogs/programs/ViewProgramVM";
import { ProgramForm } from "../../../components/forms/ProgramForm";

export const ViewProgram = observer(() => {
  const params = useParams<{ id: string }>();
  const [vm, setVm] = useState<ViewProgramVM | null>(null);
  useEffect(() => {
    if (params.id !== undefined) {
      setVm(new ViewProgramVM(Number(params.id)));
    }
  }, [params]);
  if (vm === null || vm.form === null) {
    return null; // todo loader
  }
  return <ProgramForm vm={vm.form} />;
});
