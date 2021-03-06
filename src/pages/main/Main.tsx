import { Route, Routes, useNavigate } from "react-router-dom";
import { TimeManagementPage } from "../TimeManagement";
import { useEffect, useState } from "react";
import { authStore } from "../../models/auth-store/AuthStore";
import { MainViewModel } from "../../view-models/pages/MainViewModel";
import { observer } from "mobx-react-lite";
import { withPermission } from "../../components/withPermission";
import { Permission } from "../../models/rolesAndPermissions";
import { configStore } from "../../models/config-store/ConfigStore";
import { Header } from "../../components/header/Header";
import { createCn } from "../../utils";
import "./Main.css";
import { LoadsDistributionPage } from "../LoadsDistribution";
import { Catalogs } from "../Catalogs";
import { useScheduleStore } from "../../models/schedule-context-store/use-schedule-context-store";
import { Admin } from "../admin/Admin";

const WrTimeManagement = withPermission(
  Permission.TimeManagementPage,
  TimeManagementPage
);

const cn = createCn("main");

const MainComponent = () => {
  const navigate = useNavigate();
  const scheduleContextStore = useScheduleStore();
  const [mainVM] = useState(
    () => new MainViewModel({ authStore, configStore, scheduleContextStore })
  );
  useEffect(() => {
    if (!mainVM.isLoading && !mainVM.isAuth) {
      navigate("/login");
    }
  });
  if (mainVM.isLoading) {
    return <div>Loading...</div>; // TODO: spinner
  }
  return (
    <div className={cn()}>
      {mainVM.header !== null && <Header vm={mainVM.header} />}
      <div className={cn("content")}>
        <Routes>
          <Route path="catalogs/*" element={<Catalogs />} />
          <Route path="time-management" element={<WrTimeManagement />} />
          <Route path="loads" element={<LoadsDistributionPage />} />
          <Route path="admin/*" element={<Admin />} />
        </Routes>
      </div>
    </div>
  );
};

export const Main = observer(MainComponent);
