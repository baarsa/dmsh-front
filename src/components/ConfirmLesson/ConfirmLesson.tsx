import { observer } from "mobx-react-lite";
import { Modal } from "../Modal/Modal";
import { ConfirmLessonVM } from "../../view-models/modals/ConfirmLessonVM";
import { LinkField } from "../fields/link-field/LinkField";
import { TimeInput } from "../time-input/TimeInput";
import "./ConfirmLesson.css";
import { createCn } from "../../utils";
import { Button, Typography } from "@mui/material";

const cn = createCn("confirm-lesson");

export const ConfirmLesson = observer(({ vm }: { vm: ConfirmLessonVM }) => {
  return (
    <Modal onClose={() => vm.handleClose()}>
      <div className={cn()}>
        <Typography className={cn("title")} variant="h5" component="div">
          Добавить урок
        </Typography>
        <div className={cn("content")}>
          <div className={cn("info")}>
            {vm.weekDay}, преподаватель {vm.teacher} для {vm.taker}
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
          <LinkField field={vm.subject} />
          <div className={cn("buttons")}>
            <Button
              variant={"contained"}
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
});
