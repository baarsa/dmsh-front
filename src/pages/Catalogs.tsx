import { Route, Routes } from "react-router-dom";
import { Subjects } from "./catalogs/subjects/Subjects";

export const Catalogs = () => {
  return (
    <Routes>
      <Route path="subjects/*" element={<Subjects />} />
    </Routes>
  );
};
