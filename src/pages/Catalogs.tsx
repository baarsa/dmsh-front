import { Route, Routes } from "react-router-dom";
import { Subjects } from "./catalogs/subjects/Subjects";
import { Teachers } from "./catalogs/teachers/Teachers";

export const Catalogs = () => {
  return (
    <Routes>
      <Route path="subjects/*" element={<Subjects />} />
      <Route path="teachers/*" element={<Teachers />} />
    </Routes>
  );
};
