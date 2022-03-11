import { ConfirmExtraEmploymentVM } from "../../view-models/modals/ConfirmExtraEmploymentVM";
import { Modal } from "../Modal/Modal";
import { StringField } from "../fields/StringField";
import { observer } from "mobx-react-lite";
import { TimeInput } from "../time-input/TimeInput";

export const ConfirmExtraEmployment = observer(
  ({ vm }: { vm: ConfirmExtraEmploymentVM }) => {
    return (
      <Modal onClose={() => vm.handleClose()}>
        <TimeInput value={vm.start} onChange={(value) => (vm.start = value)} />
        <TimeInput value={vm.end} onChange={(value) => (vm.end = value)} />
        <StringField field={vm.description} />
        <button onClick={() => vm.handleConfirm()}>OK</button>
      </Modal>
    );
  }
);
