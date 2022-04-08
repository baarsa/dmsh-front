import { FieldType } from "./FieldType";
import { IBooleanField } from "./IBooleanField";
import { computed, makeObservable, observable } from "mobx";
import { IFormModel } from "../forms/FormModel";

export type FieldConstructorProps = {
  label: string;
  controllingField?: IBooleanField;
  isDisabled?: boolean;
};

export abstract class FieldVM {
  set parentForm(value: IFormModel | null) {
    this._parentForm = value;
  }
  set isDisabled(value: boolean) {
    this._isDisabled = value;
  }

  get isDisabled(): boolean {
    return (
      (this._parentForm !== null && this._parentForm.mode === "view") ||
      this._isDisabled ||
      (this.controllingField !== null && !this.controllingField.value)
    );
  }
  get isVisible() {
    return this.controllingField === null || this.controllingField.value;
  }
  protected abstract fieldType: FieldType;
  abstract isValid(): boolean;
  protected controllingField: IBooleanField | null = null;
  private readonly _label: string;
  private _isDisabled: boolean;
  private _parentForm: IFormModel | null = null;
  getFieldType() {
    return this.fieldType;
  }
  get label() {
    return this._label;
  }
  constructor(props: FieldConstructorProps) {
    this._label = props.label;
    this.controllingField = props.controllingField ?? null;
    this._isDisabled = props.isDisabled ?? false;
    makeObservable<FieldVM, "_isDisabled">(this, {
      _isDisabled: observable,
      isDisabled: computed,
    });
  }
}
