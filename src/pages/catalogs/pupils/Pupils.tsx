import { observer } from "mobx-react-lite";
import { useState } from "react";
import { EntitySection } from "../../../components/entity-section/EntitySection";
import { Route, Routes } from "react-router-dom";
import { PupilsVM } from "../../../view-models/pages/catalogs/pupils/PupilsVM";
import { EditPupil } from "./EditPupil";
import { ViewPupil } from "./ViewPupil";
import { CreatePupil } from "./CreatePupil";

export const Pupils = observer(() => {
  const [pupilsVM] = useState(() => new PupilsVM());
  if (pupilsVM.isLoading) {
    return null; //todo loader
  }
  return (
    <EntitySection
      title={"Группы"}
      items={pupilsVM.items.map((item) => ({
        ...item,
        link: String(item.id),
      }))}
    >
      <Routes>
        <Route path="create" element={<CreatePupil />} />
        <Route path=":id/edit" element={<EditPupil />} />
        <Route path=":id" element={<ViewPupil />} />
      </Routes>
    </EntitySection>
  );
});
