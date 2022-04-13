import { autorun, makeAutoObservable } from "mobx";
import { pupilRepository } from "../../../../models/pupil/PupilRepository";

export class PupilsVM {
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
