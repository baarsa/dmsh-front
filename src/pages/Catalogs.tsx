import { Route, Routes } from "react-router-dom";
import { Programs } from "./catalogs/programs/Programs";
import { Subjects } from "./catalogs/subjects/Subjects";
import { Teachers } from "./catalogs/teachers/Teachers";
import { Schedules } from "./catalogs/schedules/Schedules";
import { Groups } from "./catalogs/groups/Groups";
import { Pupils } from "./catalogs/pupils/Pupils";

export const Catalogs = () => {
  return (
    <Routes>
      <Route path="subjects/*" element={<Subjects />} />
      <Route path="teachers/*" element={<Teachers />} />
      <Route path="programs/*" element={<Programs />} />
      <Route path="schedules/*" element={<Schedules />} />
      <Route path="groups/*" element={<Groups />} />
      <Route path="pupils/*" element={<Pupils />} />
    </Routes>
  );
};
