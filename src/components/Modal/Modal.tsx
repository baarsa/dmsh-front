import { FC } from "react";
import { createCn } from "../../utils";

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
      <div className={cn("cross")} onClick={() => onClose()}>
        x
      </div>
      {children}
    </div>
  </div>
);
