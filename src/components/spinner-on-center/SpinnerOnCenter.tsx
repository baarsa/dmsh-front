import { createCn } from "../../utils";
import "./SpinnerOnCenter.css";
import { CircularProgress } from "@mui/material";

const cn = createCn("spinner-on-center");

type Props = {
  withBlur?: boolean;
};

export const SpinnerOnCenter = ({ withBlur = true }: Props) => (
  <div className={cn({ "with-blur": withBlur })}>
    <CircularProgress className={cn("spinner")} />
  </div>
);
