import { observer } from "mobx-react-lite";
import { useState } from "react";
import { EntitySection } from "../../../components/entity-section/EntitySection";
import { Route, Routes } from "react-router-dom";
import { ProgramsVM } from "../../../view-models/pages/catalogs/programs/ProgramsVM";
import { CreateProgram } from "./CreateProgram";
import { EditProgram } from "./EditProgram";
import { ViewProgram } from "./ViewProgram";

export const Programs = observer(() => {
  const [programsVM] = useState(() => new ProgramsVM());
  if (programsVM.isLoading) {
    return null; //todo loader
  }
  return (
    <EntitySection
      title={"Программы"}
      items={programsVM.items.map((item) => ({
        ...item,
        link: String(item.id),
      }))}
    >
      <Routes>
        <Route path="create" element={<CreateProgram />} />
        <Route path=":id/edit" element={<EditProgram />} />
        <Route path=":id" element={<ViewProgram />} />
      </Routes>
    </EntitySection>
  );
});
