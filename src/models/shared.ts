import { IEntityService } from "../services/shared";
import {IPupil} from "../entities/IPupil";
import {IGroup} from "../entities/IGroup";
import {action, computed, getObserverTree, makeAutoObservable, makeObservable, observable, runInAction} from "mobx";

export interface IEntity {
  // сущность, не сохраненная на сервер. remove (no need)
}

export interface INamedEntity {
  name: string;
}

export interface StoredEntity extends IEntity {
  // сохраненная на сервер и получившая id
  id: number;
}

// maybe put somewhere else
export type Stored<T> = T & { id: number } & (T extends IPupil | IGroup ? { lessonTakerId: number } : {});

export interface IEntityRepository<T extends IEntity> {
  // класс сущности; данные для инстанцирования
  readonly entities: Record<number, Stored<T>>;
  getEntityById(id: number): Promise<Stored<T> | null>;
  // addEntity(entityData: K): Promise<boolean>; // whether is has been successfully persisted
}

export abstract class GenericEntityRepository<T extends IEntity, K>
  implements IEntityRepository<T> {
  private _entityService: IEntityService<K>;
  private createEntity: (props: Stored<K>) => Stored<T>;
  private _entities: Record<number, Stored<T>> = {};
  private _isSynchronized = false; // think if we need another cases (something was implicitly updated? added new child in relations?)
  private async getAllEntities() {
      const items = await this._entityService.fetchAll(); // todo maybe exclude ids we already have?
      items.forEach(item => {
        this._entities[item.id] = this.createEntity(item); // todo maybe optimize by adding all at once?
      })
      this._isSynchronized = true;
  }
  get entities(): Record<number, Stored<T>> {
    if (!this._isSynchronized) {
      void this.getAllEntities();
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
  async addEntity(entityData: K): Promise<boolean> {
    const response = await this._entityService.saveToServer(entityData);
    if (response === null) {
      return false;
    }
    runInAction(() => { // todo investigate optimization possibilities
      this._entities = { ...this.entities, [response.id]: this.createEntity(response) };
    });
    return true; // or maybe we need to return entity?
  }

  constructor(props: {
    entityService: IEntityService<K>;
    createEntity: (props: Stored<K>) => Stored<T>;
  }) {
    this._entityService = props.entityService;
    this.createEntity = props.createEntity;
    makeObservable<GenericEntityRepository<T, K>, '_entities' | '_isSynchronized'>(this, {
      _entities: observable,
      entities: computed,
      _isSynchronized: observable,
      isSynchronized: computed,
    });
  }
}
