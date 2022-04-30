import { HeaderVM } from "../../view-models/HeaderVM";
import { createCn } from "../../utils";
import { Navigation } from "../Navigation/Navigation";
import "./Header.css";
import LogoutIcon from "@mui/icons-material/Logout";
import { ActiveSchedule } from "../active-schedule/ActiveSchedule";
import { useNavigate } from "react-router-dom";

type Props = {
  vm: HeaderVM;
};

const cn = createCn("header");

export const Header = ({ vm }: Props) => {
  const navigate = useNavigate();
  return (
    <div className={cn()}>
      <div className={cn("content")}>
        <div className={cn("logo")} />
        <Navigation vm={vm.navigation} />
        <ActiveSchedule vm={vm.activeSchedule} />
        <div className={cn("username")}>
          Добрый день, {vm.userName}!
          <div
            className={cn("logout")}
            onClick={async () => {
              await vm.handleLogout();
              navigate("/login");
            }}
          >
            Выйти <LogoutIcon />
          </div>
        </div>
      </div>
    </div>
  );
};
