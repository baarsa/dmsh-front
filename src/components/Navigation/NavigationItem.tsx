import { NavigationItemDescription } from "../../view-models/NavigationVM";
import { Link } from "react-router-dom";
import "./NavigationItem.css";
import { createCn } from "../../utils";

const cn = createCn("navigation-item");

type LinkProps = {
  text: string;
  fullUrl: string;
  currentUrl: string;
};
const NavigationItemLink = (props: LinkProps) => {
  return (
    <Link
      className={cn("link", { active: props.currentUrl === props.fullUrl })}
      to={props.fullUrl}
    >
      {props.text}
    </Link>
  );
};

type GroupProps = {
  text: string;
  fullUrl: string;
  currentUrl: string;
  items: NavigationItemDescription[];
};
const NavigationItemGroup = (props: GroupProps) => {
  return (
    <div
      className={cn("item-group", {
        active: props.currentUrl.startsWith(props.fullUrl),
      })}
    >
      <div>{props.text}</div>
      <div className={cn("item-group-popup")}>
        {props.items.map((item) => (
          <NavigationItemLink
            key={item.text}
            text={item.text}
            currentUrl={props.currentUrl}
            fullUrl={`${props.fullUrl}${item.url}`}
          />
        ))}
      </div>
    </div>
  );
};

type NavigationItemProps = {
  text: string;
  fullUrl: string;
  currentUrl: string;
  childrenItems?: NavigationItemDescription[];
};

export const NavigationItem = (props: NavigationItemProps) => {
  return (
    <div className={cn({ active: props.currentUrl.startsWith(props.fullUrl) })}>
      {props.childrenItems === undefined ? (
        <NavigationItemLink {...props} />
      ) : (
        <NavigationItemGroup {...props} items={props.childrenItems} />
      )}
    </div>
  );
};
