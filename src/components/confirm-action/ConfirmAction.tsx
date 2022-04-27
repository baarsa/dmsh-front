import { ConfirmActionVM } from "../../view-models/modals/ConfirmActionVM";
import { Modal } from "../Modal/Modal";
import { Button, Typography } from "@mui/material";
import { createCn } from "../../utils";
import "./ConfirmAction.css";

const cn = createCn("confirm-action");

export const ConfirmAction = ({ vm }: { vm: ConfirmActionVM }) => {
  return (
    <Modal onClose={() => vm.handleClose()}>
      <div className={cn()}>
        <Typography className={cn("title")} variant="h5" component="div">
          {vm.title}
        </Typography>
        <div className={cn("info")}>{vm.text}</div>
        <div className={cn("buttons")}>
          <Button variant={"contained"} onClick={() => vm.handleConfirm()}>
            OK
          </Button>
          <Button variant={"contained"} onClick={() => vm.handleClose()}>
            Отмена
          </Button>
        </div>
      </div>
    </Modal>
  );
};
