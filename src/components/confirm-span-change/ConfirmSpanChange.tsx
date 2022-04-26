import { createCn } from "../../utils";
import { observer } from "mobx-react-lite";
import { Modal } from "../Modal/Modal";
import { Button, Typography } from "@mui/material";
import { TimeInput } from "../time-input/TimeInput";
import { ConfirmSpanChangeVM } from "../../view-models/modals/ConfirmSpanChangeVM";
import "./ConfirmSpanChange.css";

const cn = createCn("confirm-span-change");

export const ConfirmSpanChange = observer(
  ({ vm }: { vm: ConfirmSpanChangeVM }) => {
    return (
      <Modal onClose={() => vm.handleClose()}>
        <div className={cn()}>
          <Typography className={cn("title")} variant="h5" component="div">
            {vm.text}
          </Typography>
          <div className={cn("content")}>
            <div className={cn("info")}>{vm.info}</div>
            <div className={cn("time-inputs")}>
              с
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
            <div className={cn("buttons")}>
              <Button
                disabled={!vm.isFormValid()}
                variant={"contained"}
                onClick={() => vm.handleSubmit()}
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
