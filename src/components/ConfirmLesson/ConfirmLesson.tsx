import { observer } from "mobx-react-lite";
import { Modal } from "../Modal/Modal";
import { ConfirmLessonVM } from "../../view-models/modals/ConfirmLessonVM";
import { LinkField } from "../fields/LinkField";

export const ConfirmLesson = observer(({ vm }: { vm: ConfirmLessonVM }) => {
  return (
    <Modal onClose={() => vm.handleClose()}>
      <input
        value={vm.start}
        onChange={(e) => {
          vm.start = Number(e.target.value);
        }}
      />
      <input
        value={vm.end}
        onChange={(e) => {
          vm.end = Number(e.target.value);
        }}
      />
      <LinkField field={vm.subject} />
      <button onClick={() => vm.handleConfirm()}>OK</button>
    </Modal>
  );
});
