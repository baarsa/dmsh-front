import { ReactNode } from "react";
import { createCn } from "../../utils";
import { NavLink } from "react-router-dom";
import "./EntitySection.css";

type Props = {
  title: string;
  items: Array<{ id: number; text: string; link: string }>;
  children: ReactNode;
};

const cn = createCn("entity-section");

export const EntitySection = ({ title, items, children }: Props) => {
  return (
    <div className={cn()}>
      <div className={cn("title")}>{title}</div>
      <NavLink to="create">Создать</NavLink>
      <div className={cn("content")}>
        <div className={cn("item-list")}>
          {items.map((item) => (
            <NavLink
              key={item.id}
              to={item.link}
              className={({ isActive }) => cn("item", { active: isActive })}
            >
              {item.text}
            </NavLink>
          ))}
        </div>
        <div className={cn("children")}>{children}</div>
      </div>
    </div>
  );
};
