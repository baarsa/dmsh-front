import { HeaderVM } from "../../view-models/HeaderVM";
import { createCn } from "../../utils";
import { Navigation } from "../Navigation/Navigation";
import "./Header.css";

type Props = {
  vm: HeaderVM;
};

const cn = createCn("header");

export const Header = ({ vm }: Props) => {
  return (
    <div className={cn()}>
      <div className={cn("logo")} />
      <Navigation vm={vm.navigation} />
      <div className={cn("username")}>Добрый день, {vm.userName}!</div>
    </div>
  );
};
