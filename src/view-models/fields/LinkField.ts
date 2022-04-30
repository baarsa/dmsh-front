import { FieldConstructorProps, FieldVM } from "./Field";
import { FieldType } from "./FieldType";
import { ILinkField } from "./ILinkField";
import { IEntityRepository, INamedEntity, Stored } from "../../models/shared";
import {autorun, computed, makeObservable, observable, reaction} from "mobx";

const EMPTY_VALUE_ID = -1;

type LinkFieldProps<T extends INamedEntity> = {
  entityModel: IEntityRepository<T, unknown>;
  entitiesFilter?: (entity: T) => boolean;
  initialValues?: Array<Stored<T>>;
  valueChangedCallback?: (newValue: T[]) => void;
  shouldSetInitialValue?: boolean;
  hasEmptyValueOption?: boolean;
  isMultiple?: boolean;
  showValuesList?: boolean;
};

export class LinkFieldVM<T extends INamedEntity>
  extends FieldVM
  implements ILinkField
{
  get isMultiple(): boolean {
    return this._isMultiple;
  }
  get showValuesList() {
    return this._showValuesList;
  }
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
  get value() {
    return this._values.length === 0 ? null : this._values[0];
  }
  fieldType: FieldType.LINK = FieldType.LINK;
  private _values: Array<Stored<T>> = [];
  entityModel: IEntityRepository<T, unknown>;
  private entitiesFilter: (entity: T) => boolean = () => true;
  private readonly _valueChangedCallback?: (newValue: T[]) => void;
  private readonly _hasEmptyValueOption: boolean;
  private readonly _isMultiple: boolean;
  private readonly _showValuesList: boolean;
  // фильтрация вариантов в зависимости от значения другого поля.
  _entities: () => Stored<T>[] = () => {
    return Object.values(this.entityModel.entities);
  };
  _isLoading = true;
  setValues(_ids: number[]) {
    if (_ids.length === 0 || _ids[0] === EMPTY_VALUE_ID) {
      this._values = [];
      if (this._valueChangedCallback !== undefined) {
        this._valueChangedCallback([]);
      }
      return;
    }
    const entities = _ids.map((id) =>
      this._entities().find((e) => e.id === id)
    );
    if (entities.some((e) => e === undefined)) {
      throw new Error(); // todo think
    }
    this._values = entities as Array<Stored<T>>;
    if (this._valueChangedCallback !== undefined) {
      this._valueChangedCallback(this._values);
    }
  }
  getValuesIds(): number[] {
    return this._values.length === 0 && this._hasEmptyValueOption
      ? [EMPTY_VALUE_ID]
      : this._values.map((value) => value.id);
  }
  isValid(): boolean {
    return this._values.length > 0;
  }

  constructor(
    props: FieldConstructorProps,
    {
      entityModel,
      entitiesFilter,
      initialValues,
      valueChangedCallback,
      shouldSetInitialValue = false,
      hasEmptyValueOption = false,
      isMultiple = false,
      showValuesList = false,
    }: LinkFieldProps<T>
  ) {
    super(props);
    this.entityModel = entityModel;
    if (entitiesFilter !== undefined) {
      this.entitiesFilter = entitiesFilter;
    }
    if (initialValues !== undefined) {
      this._values = initialValues;
    }
    this._valueChangedCallback = valueChangedCallback;
    this._hasEmptyValueOption = hasEmptyValueOption;
    this._isMultiple = isMultiple;
    this._showValuesList = showValuesList;
    makeObservable<LinkFieldVM<T>, "_values">(this, {
      _entities: observable,
      options: computed,
      isLoading: computed,
      _values: observable,
    });
    if (shouldSetInitialValue) {
      autorun(() => {
        if (
          this.options.length > 0 &&
          initialValues === undefined &&
          this._values.length === 0
        ) {
          this.setValues([this.options[0].id]);
        }
      });
    }
    reaction(() => this.options,(options) => {
      if (options.every(option => option.id !== this.value?.id)) {
        this._values = [];
      }
    });
  }
}
