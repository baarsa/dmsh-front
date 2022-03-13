import { NavigationItemDescription } from "../../view-models/NavigationVM";
import { Link } from "react-router-dom";
import { useState } from "react";
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
    <Link className={cn("link")} to={props.fullUrl}>
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
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div onClick={() => setIsOpen(!isOpen)}>{props.text}</div>
      <div style={{ display: isOpen ? "block" : "none" }}>
        {props.items.map((item) => (
          <NavigationItem
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
    <div className={cn({ active: props.fullUrl.startsWith(props.currentUrl) })}>
      {props.childrenItems === undefined ? (
        <NavigationItemLink {...props} />
      ) : (
        <NavigationItemGroup {...props} items={props.childrenItems} />
      )}
    </div>
  );
};
