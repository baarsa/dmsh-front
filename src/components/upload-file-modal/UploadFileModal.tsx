import {Modal} from "../Modal/Modal";
import {Button, Typography} from "@mui/material";
import {createCn} from "../../utils";
import {UploadFileVM} from "../../view-models/modals/UploadFileVM";
import {observer} from "mobx-react-lite";

const cn = createCn('upload-file-modal');

export const UploadFileModal = observer(({ vm }: { vm: UploadFileVM }) => {
    return (
        <Modal onClose={() => vm.handleClose()}>
            <div className={cn()}>
                <Typography className={cn("title")} variant="h5" component="div">
                    {vm.title}
                </Typography>
                <input type="file" onChange={(e) => {
                    vm.handleFileChange(e.target.files === null ? null : e.target.files[0]);
                }} />
                { vm.selectedFileName }
                <div className={cn("buttons")}>
                    <Button disabled={vm.isSubmitDisabled} variant={"contained"} onClick={() => vm.handleConfirm()}>
                        OK
                    </Button>
                    <Button variant={"contained"} onClick={() => vm.handleClose()}>
                        Отмена
                    </Button>
                </div>
            </div>
        </Modal>
    );
});