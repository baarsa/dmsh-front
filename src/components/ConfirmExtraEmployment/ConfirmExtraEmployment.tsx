import { ConfirmExtraEmploymentVM } from "../../view-models/modals/ConfirmExtraEmploymentVM";
import { Modal } from "../Modal/Modal";
import { StringField } from "../fields/StringField";
import { observer } from "mobx-react-lite";
import { TimeInput } from "../time-input/TimeInput";
import { Button, Typography } from "@mui/material";
import { createCn } from "../../utils";
import "./ConfirmExtraEmployment.css";

const cn = createCn("confirm-extra-employment");

export const ConfirmExtraEmployment = observer(
  ({ vm }: { vm: ConfirmExtraEmploymentVM }) => {
    return (
      <Modal onClose={() => vm.handleClose()}>
        <div className={cn()}>
          <Typography className={cn("title")} variant="h5" component="div">
            Добавить занятость
          </Typography>
          <div className={cn("content")}>
            <div className={cn("time-inputs")}>
              С
              <TimeInput
                className={cn("time-input")}
                value={vm.start}
                onChange={(value) => (vm.start = value)}
              />
              до
              <TimeInput
                className={cn("time-input")}
                value={vm.end}
                onChange={(value) => (vm.end = value)}
              />
            </div>
            <StringField field={vm.description} />
            <div className={cn("buttons")}>
              <Button variant={"contained"} onClick={() => vm.handleConfirm()}>
                OK
              </Button>
              <Button variant={"contained"} onClick={() => vm.handleClose()}>
                Отмена
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
);
