import {ConfirmAssistanceVM} from "../../view-models/modals/ConfirmAssistanceVM";
import {Modal} from "../Modal/Modal";
import {Typography} from "@mui/material";
import {TimeInput} from "../time-input/TimeInput";
import {LinkField} from "../fields/link-field/LinkField";
import {Button} from "../button/Button";
import {createCn} from "../../utils";
import "./ConfirmAssistance.css";
import {observer} from "mobx-react-lite";

type Props = {
    vm: ConfirmAssistanceVM;
}

const cn = createCn('confirm-assistance');

export const ConfirmAssistance = observer(({ vm }: Props) => {
    return (
        <Modal onClose={() => vm.handleClose()}>
            <div className={cn()}>
                <Typography className={cn("title")} variant="h5" component="div">
                    Добавить иллюстратора/концертмейстера
                </Typography>
                <div className={cn("content")}>
                    <div className={cn("info")}>
                        Урок по предмету "{ vm.subject }" в {vm.weekDay}, преподаватель {vm.mainTeacher} для {vm.taker}
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
                    <LinkField field={vm.assistant} />
                    <div className={cn("buttons")}>
                        <Button
                            onClick={() => vm.handleConfirm()}
                            disabled={!vm.isFormValid()}
                        >
                            OK
                        </Button>
                        <Button onClick={() => vm.handleClose()}>Отмена</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
});