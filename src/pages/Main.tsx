import { Route, Routes, useNavigate } from "react-router-dom";
import { Subjects } from "./Subjects";
import { TimeManagementPage } from "./TimeManagement";
import { Navigation } from "../components/Navigation/Navigation";
import { useEffect, useState } from "react";
import { authStore } from "../models/auth-store/AuthStore";
import { MainViewModel } from "../view-models/pages/MainViewModel";
import { observer } from "mobx-react-lite";
import { withPermission } from "../components/withPermission";
import { Permission } from "../models/rolesAndPermissions";

const WrTimeManagement = withPermission(
  Permission.TimeManagementPage,
  TimeManagementPage
);

const MainComponent = () => {
  const navigate = useNavigate();
  const [mainVM] = useState(() => new MainViewModel(authStore));
  useEffect(() => {
    if (!mainVM.isLoading && !mainVM.isAuth) {
      navigate("/login");
    }
  });
  if (mainVM.isLoading) {
    return <div>Loading...</div>; // TODO: spinner
  }
  if (mainVM.navigation === null) {
    throw new Error("No navigation");
  }
  return (
    <div>
      main page
      <Navigation vm={mainVM.navigation} />
      <Routes>
        <Route path="subjects/*" element={<Subjects />} />
        <Route path="time-management" element={<WrTimeManagement />} />
      </Routes>
      ;
    </div>
  );
};

export const Main = observer(MainComponent);
