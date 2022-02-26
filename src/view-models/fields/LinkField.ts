import { FieldConstructorProps, FieldVM } from "./Field";
import { FieldType } from "./FieldType";
import { ILinkField } from "./ILinkField";
import { IEntityRepository, INamedEntity, Stored } from "../../models/shared";
import { Option } from "./Option";

export class LinkFieldVM<T extends INamedEntity> extends FieldVM
  implements ILinkField {
  fieldType: FieldType.LINK = FieldType.LINK;
  value: Stored<T> | null = null;
  entityModel: IEntityRepository<T>;
  private entitiesFilter: (entity: T) => boolean = () => true; //need method to update
  // фильтрация вариантов в зависимости от значения другого поля.
  getOptions(): Option[] {
    return Object.values(this.entityModel.getAllEntities())
      .filter(this.entitiesFilter)
      .map((entity) => ({
        id: entity.id,
        text: entity.name
      }));
  }
  setValue(id: number) {
    this.value = this.entityModel.getAllEntities()[id];
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
  }
}
