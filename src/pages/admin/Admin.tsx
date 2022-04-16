import { observer } from "mobx-react-lite";
import { useState } from "react";
import { EntitySection } from "../../components/entity-section/EntitySection";
import { Route, Routes } from "react-router-dom";
import { AdminVM } from "../../view-models/pages/admin/AdminVM";
import { CreateUser } from "./CreateUser";
import { EditUser } from "./EditUser";
import { ViewUser } from "./ViewUser";

export const Admin = observer(() => {
  const [adminVM] = useState(() => new AdminVM());
  if (adminVM.isLoading) {
    return null; //todo loader
  }
  return (
    <EntitySection
      title={"Пользователи"}
      items={adminVM.items.map((item) => ({
        ...item,
        link: String(item.id),
      }))}
    >
      <Routes>
        <Route path="create" element={<CreateUser />} />
        <Route path=":id/edit" element={<EditUser />} />
        <Route path=":id" element={<ViewUser />} />
      </Routes>
    </EntitySection>
  );
});
