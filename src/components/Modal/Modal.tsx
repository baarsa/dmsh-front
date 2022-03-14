import { FC } from "react";
import { createCn } from "../../utils";
import CloseIcon from "@mui/icons-material/Close";

import "./Modal.css";

const cn = createCn("modal");

type Props = {
  onClose: () => void;
};

export const Modal: FC<Props> = ({ children, onClose }) => (
  <div
    className={cn()}
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}
  >
    <div className={cn("popup")}>
      <CloseIcon className={cn("cross")} onClick={() => onClose()} />
      {children}
    </div>
  </div>
);
