import { Modal } from "../Modal/Modal";
import { Typography } from "@mui/material";
import { createCn } from "../../utils";
import { UploadFileVM } from "../../view-models/modals/UploadFileVM";
import { observer } from "mobx-react-lite";
import { Button } from "../button/Button";
import "./UploadFileModal.css";
import {QuestionMark} from "@mui/icons-material";

const cn = createCn("upload-file-modal");

export const UploadFileModal = observer(({ vm }: { vm: UploadFileVM }) => {
  return (
    <Modal onClose={() => vm.handleClose()}>
      <div className={cn()}>
        <Typography className={cn("title")} variant="h5" component="div">
          {vm.title}
        </Typography>
          <div className={cn('help')}>Требуемый формат данных в файле<QuestionMark fontSize="small" /></div>
        <input
          type="file"
          accept=".xlsx,.csv"
          onChange={(e) => {
            vm.handleFileChange(
              e.target.files === null ? null : e.target.files[0]
            );
          }}
        />
        <div className={cn("buttons")}>
          <Button
            disabled={vm.isSubmitDisabled}
            onClick={() => vm.handleConfirm()}
          >
            OK
          </Button>
          <Button onClick={() => vm.handleClose()}>Отмена</Button>
        </div>
      </div>
    </Modal>
  );
});
