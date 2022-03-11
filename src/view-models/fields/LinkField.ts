import { FieldConstructorProps, FieldVM } from "./Field";
import { FieldType } from "./FieldType";
import { ILinkField } from "./ILinkField";
import { IEntityRepository, INamedEntity, Stored } from "../../models/shared";
import { autorun, computed, makeObservable, observable } from "mobx";

export class LinkFieldVM<T extends INamedEntity>
  extends FieldVM
  implements ILinkField
{
  fieldType: FieldType.LINK = FieldType.LINK;
  value: Stored<T> | null = null;
  entityModel: IEntityRepository<T>;
  private entitiesFilter: (entity: T) => boolean = () => true; //need method to update? or function using observable will update itself?
  // фильтрация вариантов в зависимости от значения другого поля.
  _entities: () => Stored<T>[] = () => {
    return Object.values(this.entityModel.entities);
  };
  _isLoading = true;
  get isLoading() {
    return this._isLoading;
  }
  get options() {
    return this._entities()
      .filter(this.entitiesFilter)
      .map((entity) => ({
        id: entity.id,
        text: entity.name,
      }));
  }
  setValue(_id: number) {
    const entity = this._entities().find(({ id }) => id === _id);
    if (entity === undefined) {
      throw new Error(); // todo think
    }
    this.value = entity;
  }
  getValueText(): string {
    if (this.value === null) {
      return "";
    }
    return this.value.name;
  }
  getValueId(): number | null {
    if (this.value === null) {
      return null;
    }
    return this.value.id;
  }
  isValid(): boolean {
    return this.value !== null;
  }

  constructor(
    props: FieldConstructorProps,
    entityModel: IEntityRepository<T>,
    entitiesFilter?: (entity: T) => boolean
  ) {
    super(props);
    this.entityModel = entityModel;
    if (entitiesFilter !== undefined) {
      this.entitiesFilter = entitiesFilter;
    }
    makeObservable(this, {
      _entities: observable,
      options: computed,
      isLoading: computed,
      value: observable,
    });
    autorun(() => {
      if (this.options.length > 0) {
        this.setValue(this.options[0].id);
      }
    });
  }
}
