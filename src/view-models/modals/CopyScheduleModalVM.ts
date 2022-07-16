import { ModalVM } from "./ModalVM";
import {StringFieldVM} from "../fields/StringField";
import {BooleanFieldVM} from "../fields/BooleanField";
import { computed, makeObservable } from "mobx";

type SubmitParameters = {
    name: string;
    nextYear: boolean;
};

type Parameters = {
    originalName: string;
    onConfirm: (parameters: SubmitParameters) => void;
    onClose: () => void;
};

export class CopyScheduleModalVM extends ModalVM {
    get name(): StringFieldVM {
        return this._name;
    }

    get nextYear(): BooleanFieldVM {
        return this._nextYear;
    }

    get isValid() {
        return this._name.isValid() && this._name.value !== this._originalName;
    }
    handleConfirm() {
        this._onConfirm({
            name: this._name.value,
            nextYear: this._nextYear.value,
        });
    }
    private readonly _onConfirm: (parameters: SubmitParameters) => void;
    private readonly _originalName: string;
    private _name: StringFieldVM = new StringFieldVM({
        label: "Название",
    });
    private _nextYear: BooleanFieldVM = new BooleanFieldVM({ label: "На следующий год" }, false);

    constructor({ onConfirm, onClose, originalName }: Parameters) {
        super(onClose);
        this._originalName = originalName;
        this._name.value = `${originalName} — копия`;
        this._onConfirm = onConfirm;
        makeObservable<CopyScheduleModalVM>(this, {
            isValid: computed,
        });
    }
}
