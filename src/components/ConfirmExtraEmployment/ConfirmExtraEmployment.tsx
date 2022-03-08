import {ConfirmExtraEmploymentVM} from "../../view-models/modals/ConfirmExtraEmploymentVM";
import {Modal} from "../Modal/Modal";
import {StringField} from "../fields/StringField";
import {observer} from "mobx-react-lite";

export const ConfirmExtraEmployment = observer(({ vm }: { vm: ConfirmExtraEmploymentVM }) => {
    return <Modal onClose={() => vm.handleClose()}>
        <input value={vm.start} onChange={e => { vm.start = Number(e.target.value) }} />
        <input value={vm.end} onChange={e => { vm.end = Number(e.target.value) }} />
        <StringField field={vm.description} />
        <button onClick={() => vm.handleConfirm()}>OK</button>
    </Modal>
});