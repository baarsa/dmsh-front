import { observer } from "mobx-react-lite";
import { Modal } from "../Modal/Modal";
import { ConfirmLessonVM } from "../../view-models/modals/ConfirmLessonVM";
import { LinkField } from "../fields/LinkField";
import { TimeInput } from "../time-input/TimeInput";

export const ConfirmLesson = observer(({ vm }: { vm: ConfirmLessonVM }) => {
  return (
    <Modal onClose={() => vm.handleClose()}>
      <TimeInput value={vm.start} onChange={(value) => (vm.start = value)} />
      <TimeInput value={vm.end} onChange={(value) => (vm.end = value)} />
      <LinkField field={vm.subject} />
      <button onClick={() => vm.handleConfirm()}>OK</button>
    </Modal>
  );
});
