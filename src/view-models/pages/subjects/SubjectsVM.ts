import { subjectRepository } from "../../../models/subject/SubjectRepository";
import { autorun, makeAutoObservable } from "mobx";

type Item = {
  id: number;
  text: string;
};

export class SubjectsVM {
  get isLoading(): boolean {
    return this._isLoading;
  }
  get items(): Item[] {
    return this._items;
  }
  private _items: Item[] = [];
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
