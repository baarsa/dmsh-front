import {Modal} from "../Modal/Modal";
import {Typography} from "@mui/material";
import {Button} from "../button/Button";
import {CopyScheduleModalVM} from "../../view-models/modals/CopyScheduleModalVM";
import {createCn} from "../../utils";
import "./CopyScheduleModal.css";
import { StringField } from "../fields/StringField";
import { BooleanField } from "../fields/BooleanField";
import {observer} from "mobx-react-lite";

const cn = createCn("copy-schedule-modal");

export const CopyScheduleModal = observer(({ vm }: { vm: CopyScheduleModalVM }) =>  (
    <Modal onClose={() => vm.handleClose()}>
        <div className={cn()}>
            <Typography className={cn("title")} variant="h5" component="div">
                Копирование расписания
            </Typography>
            <div className={cn("content")}>
                <StringField field={vm.name} />
                <BooleanField field={vm.nextYear} />
                <div className={cn("buttons")}>
                    <Button
                        disabled={!vm.isValid}
                        onClick={() => vm.handleConfirm()}
                    >
                        OK
                    </Button>
                    <Button onClick={() => vm.handleClose()}>Отмена</Button>
                </div>
            </div>
        </div>
    </Modal>
));