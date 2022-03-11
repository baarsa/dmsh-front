import { FieldType } from "./FieldType";
import { IBooleanField } from "./IBooleanField";
import { computed, makeObservable, observable } from "mobx";

export type FieldConstructorProps = {
  label: string;
  controllingField?: IBooleanField;
  isDisabled?: boolean;
};

export abstract class FieldVM {
  set isDisabled(value: boolean) {
    this._isDisabled = value;
  }

  get isDisabled(): boolean {
    return (
      this._isDisabled ||
      (this.controllingField !== null && !this.controllingField.value)
    );
  }
  protected abstract fieldType: FieldType;
  abstract isValid(): boolean;
  protected controllingField: IBooleanField | null = null;
  private readonly label: string;
  private _isDisabled: boolean;
  getFieldType() {
    return this.fieldType;
  }
  getLabel() {
    return this.label;
  }
  constructor(props: FieldConstructorProps) {
    this.label = props.label;
    this.controllingField = props.controllingField ?? null;
    this._isDisabled = props.isDisabled ?? false;
    makeObservable<FieldVM, "_isDisabled">(this, {
      _isDisabled: observable,
      isDisabled: computed,
    });
  }
}
