import { observer } from "mobx-react-lite";
import { useState } from "react";
import { EntitySection } from "../../../components/entity-section/EntitySection";
import { Route, Routes } from "react-router-dom";
import { TeachersVM } from "../../../view-models/pages/teachers/TeachersVM";
import { CreateTeacher } from "./CreateTeacher";
import { EditTeacher } from "./EditTeacher";
import { ViewTeacher } from "./ViewTeacher";

export const Teachers = observer(() => {
  const [teachersVM] = useState(() => new TeachersVM());
  if (teachersVM.isLoading) {
    return null; //todo loader
  }
  return (
    <EntitySection
      title={"Преподаватели"}
      items={teachersVM.items.map((item) => ({
        ...item,
        link: String(item.id),
      }))}
    >
      <Routes>
        <Route path="create" element={<CreateTeacher />} />
        <Route path=":id/edit" element={<EditTeacher />} />
        <Route path=":id" element={<ViewTeacher />} />
      </Routes>
    </EntitySection>
  );
});
