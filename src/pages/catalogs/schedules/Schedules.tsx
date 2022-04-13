import { observer } from "mobx-react-lite";
import { useState } from "react";
import { EntitySection } from "../../../components/entity-section/EntitySection";
import { Route, Routes } from "react-router-dom";
import { SchedulesVM } from "../../../view-models/pages/catalogs/schedules/SchedulesVM";
import { CreateSchedule } from "./CreateSchedule";
import { EditSchedule } from "./EditSchedule";
import { ViewSchedule } from "./ViewSchedule";

export const Schedules = observer(() => {
  const [schedulesVM] = useState(() => new SchedulesVM());
  if (schedulesVM.isLoading) {
    return null; //todo loader
  }
  return (
    <EntitySection
      title={"Расписания"}
      items={schedulesVM.items.map((item) => ({
        ...item,
        link: String(item.id),
      }))}
    >
      <Routes>
        <Route path="create" element={<CreateSchedule />} />
        <Route path=":id/edit" element={<EditSchedule />} />
        <Route path=":id" element={<ViewSchedule />} />
      </Routes>
    </EntitySection>
  );
});
