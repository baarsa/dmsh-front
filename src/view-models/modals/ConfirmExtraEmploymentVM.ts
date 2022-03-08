import {StringFieldVM} from "../fields/StringField";
import { makeObservable, observable} from "mobx";
import {ModalVM} from "./ModalVM";

type ConfirmParameters = {
    start: number;
    end: number;
    description: string;
}

export class ConfirmExtraEmploymentVM extends ModalVM {
    get description(): StringFieldVM {
        return this._description;
    }
    get start(): number {
        return this._start;
    }

    set start(value: number) {
        this._start = value;
    }

    get end(): number {
        return this._end;
    }

    set end(value: number) {
        this._end = value;
    }
    private _start: number;
    private _end: number;
    private _description: StringFieldVM = new StringFieldVM({ label: 'Описание' });

    handleConfirm() {
        this._onConfirm({
            start: this._start,
            end: this._end,
            description: this._description.value,
        });
    }
    _onConfirm: (parameters: ConfirmParameters) => void;

    constructor({
                    start,
                    end,
                    onConfirm,
                    onClose
                }: { start: number; end: number; onConfirm: (parameters: ConfirmParameters) => void; onClose: () => void }) {
        super(onClose);
        this._start = start;
        this._end = end;
        this._onConfirm = onConfirm;
        makeObservable<ConfirmExtraEmploymentVM, '_start' | '_end' | '_description'>(this, {
            _start: observable,
            _end: observable,
            _description: observable,
        });
    }
}