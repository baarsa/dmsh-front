import { DisplayNavigationItemDescription } from "../../view-models/NavigationVM";
import { Link } from "react-router-dom";
import "./NavigationItem.css";
import { createCn } from "../../utils";

const cn = createCn("navigation-item");

type LinkProps = {
  text: string;
  fullUrl: string;
  currentUrl: string;
  isDisabled: boolean;
};
const NavigationItemLink = (props: LinkProps) => {
  return (
    <Link
      className={cn("link", {
        active: props.currentUrl === props.fullUrl,
        disabled: props.isDisabled,
      })}
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
  items: DisplayNavigationItemDescription[];
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
        <div className={cn("item-group-popup-content")}>
        {props.items.map((item) => (
          <NavigationItemLink
            key={item.text}
            text={item.text}
            currentUrl={props.currentUrl}
            fullUrl={`${props.fullUrl}${item.url}`}
            isDisabled={item.isDisabled}
          />
        ))}
        </div>
      </div>
    </div>
  );
};

type NavigationItemProps = {
  text: string;
  fullUrl: string;
  currentUrl: string;
  childrenItems?: DisplayNavigationItemDescription[];
  isDisabled: boolean;
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
