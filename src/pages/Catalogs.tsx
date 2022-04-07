import { Route, Routes } from "react-router-dom";
import { Subjects } from "./Subjects";

export const Catalogs = () => {
  return (
    <Routes>
      <Route path="subjects/*" element={<Subjects />} />
    </Routes>
  );
};
