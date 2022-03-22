import { FieldConstructorProps, FieldVM } from "./Field";
import { FieldType } from "./FieldType";
import { ILinkField } from "./ILinkField";
import { IEntityRepository, INamedEntity, Stored } from "../../models/shared";
import { autorun, computed, makeObservable, observable } from "mobx";

const EMPTY_VALUE_ID = -1;

type LinkFieldProps<T extends INamedEntity> = {
  entityModel: IEntityRepository<T, unknown>;
  entitiesFilter?: (entity: T) => boolean;
  initialValue?: Stored<T>;
  valueChangedCallback?: (newValue: T | null) => void;
  shouldSetInitialValue?: boolean;
  hasEmptyValueOption?: boolean;
};

export class LinkFieldVM<T extends INamedEntity>
  extends FieldVM
  implements ILinkField
{
  fieldType: FieldType.LINK = FieldType.LINK;
  value: Stored<T> | null = null;
  entityModel: IEntityRepository<T, unknown>;
  private entitiesFilter: (entity: T) => boolean = () => true;
  private readonly _valueChangedCallback?: (newValue: T | null) => void;
  private readonly _hasEmptyValueOption: boolean;
  // фильтрация вариантов в зависимости от значения другого поля.
  _entities: () => Stored<T>[] = () => {
    return Object.values(this.entityModel.entities);
  };
  _isLoading = true;
  get isLoading() {
    return this._isLoading;
  }
  get options() {
    return [
      ...(this._hasEmptyValueOption
        ? [
            {
              id: EMPTY_VALUE_ID,
              text: "Не выбрано",
            },
          ]
        : []),
      ...this._entities()
        .filter(this.entitiesFilter)
        .map((entity) => ({
          id: entity.id,
          text: entity.name,
        })),
    ];
  }
  setValue(_id: number | undefined) {
    if (_id === EMPTY_VALUE_ID) {
      this.value = null;
      if (this._valueChangedCallback !== undefined) {
        this._valueChangedCallback(null);
      }
      return;
    }
    const entity = this._entities().find(({ id }) => id === _id);
    if (entity === undefined) {
      throw new Error(); // todo think
    }
    this.value = entity;
    if (this._valueChangedCallback !== undefined) {
      this._valueChangedCallback(entity);
    }
  }
  getValueId(): number {
    if (this.value === null) {
      return EMPTY_VALUE_ID;
    }
    return this.value.id;
  }
  isValid(): boolean {
    return this.value !== null;
  }

  constructor(
    props: FieldConstructorProps,
    {
      entityModel,
      entitiesFilter,
      initialValue,
      valueChangedCallback,
      shouldSetInitialValue = false,
      hasEmptyValueOption = false,
    }: LinkFieldProps<T>
  ) {
    super(props);
    this.entityModel = entityModel;
    if (entitiesFilter !== undefined) {
      this.entitiesFilter = entitiesFilter;
    }
    if (initialValue !== undefined) {
      this.value = initialValue;
    }
    this._valueChangedCallback = valueChangedCallback;
    this._hasEmptyValueOption = hasEmptyValueOption;
    makeObservable(this, {
      _entities: observable,
      options: computed,
      isLoading: computed,
      value: observable,
    });
    if (shouldSetInitialValue) {
      autorun(() => {
        if (this.options.length > 0 && initialValue === undefined) {
          this.setValue(this.options[0].id);
        }
      });
    }
  }
}
