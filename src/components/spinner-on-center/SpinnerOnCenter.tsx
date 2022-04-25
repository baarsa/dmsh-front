import { createCn } from "../../utils";
import "./SpinnerOnCenter.css";
import { CircularProgress } from "@mui/material";

const cn = createCn("spinner-on-center");

export const SpinnerOnCenter = () => (
  <div className={cn()}>
    <CircularProgress className={cn("spinner")} />
  </div>
);
