import { subjectRepository } from "../../../models/subject/SubjectRepository";
import { autorun, makeAutoObservable } from "mobx";

export class SubjectsVM {
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

  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      this._items = Object.values(subjectRepository.entities).map((entity) => ({
        id: entity.id,
        text: entity.name,
      }));
    });
    autorun(() => {
      this._isLoading = !subjectRepository.isSynchronized;
    });
  }
}
