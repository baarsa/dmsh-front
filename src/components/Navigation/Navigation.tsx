import { NavigationVM } from "../../view-models/NavigationVM";
import { useLocation } from "react-router-dom";
import { NavigationItem } from "./NavigationItem";
import "./Navigation.css";
import { createCn } from "../../utils";
import { observer } from "mobx-react-lite";

const cn = createCn("navigation");

export const Navigation = observer((props: { vm: NavigationVM }) => {
  const location = useLocation();
  return (
    <nav className={cn()}>
      {props.vm.items.map((item) => (
        <NavigationItem
          key={item.url}
          text={item.text}
          fullUrl={item.url}
          currentUrl={location.pathname}
          childrenItems={item.children}
          isDisabled={item.isDisabled}
        />
      ))}
    </nav>
  );
});
