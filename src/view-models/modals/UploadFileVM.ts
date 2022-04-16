import {ModalVM} from "./ModalVM";
import {computed, makeObservable, observable} from "mobx";

type Parameters = {
    title: string;
    onConfirm: (data: FormData) => void;
    onClose: () => void;
};

export class UploadFileVM extends ModalVM {
    get title(): string {
        return this._title;
    }

    get isSubmitDisabled() {
        return this._selectedFile === null;
    }

    get selectedFileName() {
        return this._selectedFile?.name ?? null;
    }

    handleConfirm() {
        if (this._selectedFile === null) {
            throw new Error('Не выбран файл');
        }
        const formData = new FormData();
        formData.append(
            "file",
            this._selectedFile,
            this._selectedFile.name
        );
        this._onConfirm(formData);
    }
    handleFileChange(file: File | null) {
        this._selectedFile = file;
    }
    private readonly _title: string;
    private _selectedFile: File | null = null;
    private readonly _onConfirm: (data: FormData) => void;

    constructor({ title, onConfirm, onClose }: Parameters) {
        super(onClose);
        this._title = title;
        this._onConfirm = onConfirm;
        makeObservable<UploadFileVM, '_selectedFile'>(this, {
            _selectedFile: observable,
            isSubmitDisabled: computed,
        });
    }
}