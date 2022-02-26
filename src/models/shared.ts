import { IEntityService } from "../services/shared";

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

// maybe put somewhere eolse
export type Stored<T> = T & { id: number };

export interface IEntityRepository<T extends IEntity> {
  // класс сущности; данные для инстанцирования
  getAllEntities(): Record<number, Stored<T>>;
  getEntityById(id: number): Promise<Stored<T> | null>;
  // addEntity(entityData: K): Promise<boolean>; // whether is has been successfully persisted
}

export abstract class GenericEntityRepository<T extends IEntity, K>
  implements IEntityRepository<T> {
  private entityService: IEntityService<K>;
  private createEntity: (props: Stored<K>) => Stored<T>;
  private entities: Record<number, Stored<T>> = {};
  getAllEntities() {
    return this.entities;
  }
  async getEntityById(id: number): Promise<Stored<T> | null> {
    if (this.entities[id] !== undefined) {
      return this.entities[id];
    }
    const serviceResponse = await this.entityService.fetchById(id);
    if (serviceResponse === null) {
      return null;
    }
    this.entities[id] = this.createEntity(serviceResponse);
    return this.entities[id];
  }
  async addEntity(entityData: K): Promise<boolean> {
    const response = await this.entityService.saveToServer(entityData);
    if (response === null) {
      return false;
    }
    this.entities[response.id] = this.createEntity(response);
    return true; // or maybe we need to return entity?
  }

  constructor(props: {
    entityService: IEntityService<K>;
    createEntity: (props: Stored<K>) => Stored<T>;
  }) {
    this.entityService = props.entityService;
    this.createEntity = props.createEntity;
  }
}
