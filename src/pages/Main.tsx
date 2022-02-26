import { Route, Routes } from "react-router-dom";
import { Subjects } from "./Subjects";
import { TimeManagementPage } from "./TimeManagement";

export const Main = () => (
  <div>
    main page
    <Routes>
      <Route path="subjects/*" element={<Subjects />} />
      <Route path="time-management" element={<TimeManagementPage />} />
    </Routes>
  </div>
);
