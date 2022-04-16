import { autorun, makeAutoObservable } from "mobx";
import { pupilRepository } from "../../../../models/pupil/PupilRepository";
import {UploadFileVM} from "../../../modals/UploadFileVM";
import {fileUploadService} from "../../../../services/fileUploadService";

export class PupilsVM {
  get uploadFileModal(): UploadFileVM | null {
    return this._uploadFileModal;
  }
  get isLoading(): boolean {
    return this._isLoading;
  }
  get items() {
    return this._items;
  }
  private _items: {
    id: number;
    text: string;
  }[] = [];
  private _isLoading: boolean = true;
  private _uploadFileModal: UploadFileVM | null = null;

  openFileUploadModal() {
    this._uploadFileModal = new UploadFileVM({
      title: 'Загрузить список учащихся',
      onClose: () => {
        this._uploadFileModal = null;
      },
      onConfirm: async (data) => {
        await fileUploadService.uploadPupils(data);
        this._uploadFileModal = null;
        document.location.reload();
      }
    });
  }

  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      this._items = Object.values(pupilRepository.entities).map((entity) => ({
        id: entity.id,
        text: entity.name,
      }));
    });
    autorun(() => {
      this._isLoading = !pupilRepository.isSynchronized;
    });
  }
}
