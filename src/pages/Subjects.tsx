import { Route, Routes } from "react-router-dom";
import { CreateSubject } from "./CreateSubject";

export const Subjects = () => (
  <div>
    subjects
    <Routes>
      <Route path="create" element={<CreateSubject />} />
    </Routes>
  </div>
);
