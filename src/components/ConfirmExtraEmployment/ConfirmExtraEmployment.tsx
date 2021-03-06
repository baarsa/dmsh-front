import { ConfirmExtraEmploymentVM } from "../../view-models/modals/ConfirmExtraEmploymentVM";
import { Modal } from "../Modal/Modal";
import { StringField } from "../fields/StringField";
import { observer } from "mobx-react-lite";
import { TimeInput } from "../time-input/TimeInput";
import { Typography } from "@mui/material";
import { createCn } from "../../utils";
import "./ConfirmExtraEmployment.css";
import { Button } from "../button/Button";

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
            <div className={cn("info")}>
              {vm.weekDay}, {vm.person}
            </div>
            <div className={cn("time-inputs")}>
              С
              <TimeInput
                className={cn("time-input")}
                value={vm.start}
                onChange={(value) => (vm.start = value)}
                error={!vm.isStartValid()}
              />
              до
              <TimeInput
                className={cn("time-input")}
                value={vm.end}
                onChange={(value) => (vm.end = value)}
                error={!vm.isEndValid()}
              />
            </div>
            <StringField field={vm.description} />
            <div className={cn("buttons")}>
              <Button
                onClick={() => vm.handleConfirm()}
                disabled={!vm.isFormValid()}
              >
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
