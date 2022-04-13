import { observer } from "mobx-react-lite";
import { useState } from "react";
import { EntitySection } from "../../../components/entity-section/EntitySection";
import { Route, Routes } from "react-router-dom";
import { GroupsVM } from "../../../view-models/pages/catalogs/groups/GroupsVM";
import { CreateGroup } from "./CreateGroup";
import { EditGroup } from "./EditGroup";
import { ViewGroup } from "./ViewGroup";

export const Groups = observer(() => {
  const [groupsVM] = useState(() => new GroupsVM());
  if (groupsVM.isLoading) {
    return null; //todo loader
  }
  return (
    <EntitySection
      title={"Группы"}
      items={groupsVM.items.map((item) => ({
        ...item,
        link: String(item.id),
      }))}
    >
      <Routes>
        <Route path="create" element={<CreateGroup />} />
        <Route path=":id/edit" element={<EditGroup />} />
        <Route path=":id" element={<ViewGroup />} />
      </Routes>
    </EntitySection>
  );
});
