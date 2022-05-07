import {ReactNode, useState} from "react";
import { createCn } from "../../utils";
import { NavLink } from "react-router-dom";
import "./EntitySection.css";
import { Button } from "../button/Button";
import {TextField} from "@mui/material";

type Props = {
  title: string;
  items: Array<{ id: number; text: string; link: string }>;
  children: ReactNode;
  onUploadClick?: () => void;
};

const cn = createCn("entity-section");

export const EntitySection = ({
  title,
  items,
  children,
  onUploadClick,
}: Props) => {
  const [value, setValue] = useState("");
  return (
    <div className={cn()}>
      <div className={cn("title")}>{title}</div>
      <div className={cn("content")}>
        <div className={cn("item-list")}>
          <div className={cn("buttons")}>
            <NavLink to="create">
              <Button>Создать</Button>
            </NavLink>
            {onUploadClick !== undefined && (
              <Button
                onClick={() => {
                  onUploadClick();
                }}
              >
                Загрузить файл
              </Button>
            )}
          </div>
          <TextField
              className={cn("filter-input")}
              spellCheck={ false }
              sx={ {
                color: 'white',
                "& .MuiFormLabel-root-MuiInputLabel-root": { color: "white" },
                "& .MuiInputBase-root-MuiOutlinedInput-root": { color: "white" },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              }}
              label={"Фильтр по ФИО"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
          />
          {items
              .filter(item => item.text.toLowerCase().includes(value.toLowerCase()))
              .map((item) => {
                const isFiltering = value.length > 0;
                const searchPosition = item.text.toLowerCase().indexOf(value.toLowerCase());
                const firstPart = item.text.slice(0, searchPosition);
                const middlePart = item.text.slice(searchPosition, searchPosition + value.length);
                const lastPart = item.text.slice(searchPosition + value.length);
                return (
                    <NavLink
                        key={item.id}
                        to={item.link}
                        className={({isActive}) => cn("item", {active: isActive})}
                    >
                      { isFiltering ? <>{ firstPart }<span className={cn("highlight")}>{ middlePart }</span>{ lastPart }</> : item.text }
                    </NavLink>
                );
              })}
        </div>
        <div className={cn("children")}>{children}</div>
      </div>
    </div>
  );
};
