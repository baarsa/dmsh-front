import { IEntityService } from "../services/shared";
import { IPupil } from "../entities/IPupil";
import { IGroup } from "../entities/IGroup";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { addError } from "../notifications";
import { getErrorMessage } from "../utils";

export interface INamedEntity {
  name: string;
}

// maybe put somewhere else
export type Stored<T> = T & { id: number } & (T extends IPupil | IGroup
    ? { lessonTakerId: number }
    : {});

export interface IEntityRepository<T, K> {
  // класс сущности; данные для инстанцирования
  readonly entities: Record<number, Stored<T>>;
  getEntityById(id: number): Promise<Stored<T> | null>;
  addEntity(entityData: K): Promise<number>;
  removeEntity(id: number): Promise<void>;
  updateEntity(id: number, entityData: Partial<K>): Promise<number>;
}

export abstract class GenericEntityRepository<T, K>
  implements IEntityRepository<T, K>
{
  private _entityService: IEntityService<K>;
  private createEntity: (props: Stored<K>) => Stored<T>;
  private _entities: Record<number, Stored<T>> = {};
  private _isSynchronized = false; // think if we need another cases (something was implicitly updated? added new child in relations?)
  private async _getAllEntities() {
    try {
      const items = await this._entityService.fetchAll(); // todo maybe exclude ids we already have?
      items.forEach((item) => {
        this._entities[item.id] = this.createEntity(item); // todo maybe optimize by adding all at once?
      });
      this._isSynchronized = true;
    } catch (e) {
      addError(getErrorMessage(e));
    }
    return this._entities;
  }
  get entities(): Record<number, Stored<T>> {
    if (!this._isSynchronized) {
      void this._getAllEntities();
    }
    return this._entities;
  }
  async getAllEntities() {
    if (!this._isSynchronized) {
      return this._getAllEntities();
    }
    return this._entities;
  }
  get isSynchronized() {
    return this._isSynchronized;
  }
  async getEntityById(id: number): Promise<Stored<T> | null> {
    if (this._entities[id] !== undefined) {
      return this.entities[id];
    }
    const serviceResponse = await this._entityService.fetchById(id);
    if (serviceResponse === null) {
      return null;
    }
    this._entities[id] = this.createEntity(serviceResponse);
    return this._entities[id];
  }
  async addEntity(entityData: K): Promise<number> {
    const response = await this._entityService.saveToServer(entityData);
    runInAction(() => {
      // todo investigate optimization possibilities
      this._entities = {
        ...this.entities,
        [response.id]: this.createEntity(response),
      };
    });
    return response.id;
  }
  async removeEntity(id: number): Promise<void> {
    await this._entityService.remove(id);
    runInAction(() => {
      // todo investigate optimization possibilities
      delete this._entities[id];
    });
  }
  async updateEntity(id: number, newData: Partial<K>) {
    const response = await this._entityService.update(id, newData);
    runInAction(() => {
      // todo investigate optimization possibilities
      this._entities[id] = this.createEntity(response);
    });
    return response.id;
  }

  constructor(props: {
    entityService: IEntityService<K>;
    createEntity: (props: Stored<K>) => Stored<T>;
  }) {
    this._entityService = props.entityService;
    this.createEntity = props.createEntity;
    makeObservable<
      GenericEntityRepository<T, K>,
      "_entities" | "_isSynchronized"
    >(this, {
      _entities: observable,
      entities: computed,
      _isSynchronized: observable,
      isSynchronized: computed,
    });
  }
}
