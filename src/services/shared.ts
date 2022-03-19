import { Stored } from "../models/shared";
// Все методы бросают ошибки при ошибке ответа или сети.
export interface IEntityService<T> {
  fetchAll: () => Promise<Array<Stored<T>>>;
  fetchById: (id: number) => Promise<Stored<T>>;
  saveToServer: (data: T) => Promise<Stored<T>>;
  update: (id: number, data: Partial<T>) => Promise<Stored<T>>;
  remove: (id: number) => Promise<void>;
}
