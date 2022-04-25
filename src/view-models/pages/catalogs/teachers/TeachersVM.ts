import { autorun, makeAutoObservable } from "mobx";
import { teacherRepository } from "../../../../models/teacher/TeacherRepository";
import { UploadFileVM } from "../../../modals/UploadFileVM";
import { fileUploadService } from "../../../../services/fileUploadService";

export class TeachersVM {
  get uploadFileModal(): UploadFileVM | null {
    return this._uploadFileModal;
  }
  get isLoading(): boolean {
    return this._isLoading;
  }
  get items() {
    return this._items;
  }

  openFileUploadModal() {
    this._uploadFileModal = new UploadFileVM({
      title: "Загрузить список преподавателей",
      onClose: () => {
        this._uploadFileModal = null;
      },
      onConfirm: async (data) => {
        await fileUploadService.uploadTeachers(data);
        this._uploadFileModal = null;
        document.location.reload();
      },
    });
  }

  private _items: {
    id: number;
    text: string;
  }[] = [];
  private _isLoading: boolean = true;
  private _uploadFileModal: UploadFileVM | null = null;

  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      this._items = Object.values(teacherRepository.entities).map((entity) => ({
        id: entity.id,
        text: entity.name,
      }));
    });
    autorun(() => {
      this._isLoading = !teacherRepository.isSynchronized;
    });
  }
}
