import { Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createCn } from "../../utils";
import "./CrossButton.css";

type Props = {
  onClick: () => void;
  title: string;
};

const cn = createCn("cross-button");

export const CrossButton = ({ onClick, title }: Props) => (
  <Tooltip className={cn()} title={title}>
    <CloseIcon onClick={onClick} />
  </Tooltip>
);
