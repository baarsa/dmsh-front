import { Stored } from "../models/shared";
// think about signatures and error handling
export interface IEntityService<T> {
  fetchById: (id: number) => Promise<Stored<T> | null>;
  saveToServer: (data: T) => Promise<Stored<T> | null>;
  update: (id: number, data: T) => Promise<Stored<T> | null>;
  remove: (id: number) => void;
}
