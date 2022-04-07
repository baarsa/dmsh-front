import { Route, Routes } from "react-router-dom";
import { CreateSubject } from "./CreateSubject";
import { EntitySection } from "../components/entity-section/EntitySection";
import { useState } from "react";
import { SubjectsVM } from "../view-models/pages/subjects/SubjectsVM";
import { observer } from "mobx-react-lite";

export const Subjects = observer(() => {
  const [subjectsVM] = useState(() => new SubjectsVM());
  if (subjectsVM.isLoading) {
    return null; //todo loader
  }
  return (
    <EntitySection
      title={"Предметы"}
      items={subjectsVM.items.map((item) => ({
        ...item,
        link: String(item.id),
      }))}
    >
      <Routes>
        <Route path="create" element={<CreateSubject />} />
      </Routes>
    </EntitySection>
  );
});
