import { FieldConstructorProps, FieldVM } from "./Field";
import { FieldType } from "./FieldType";
import { IBooleanField } from "./IBooleanField";
import { computed, makeObservable, observable } from "mobx";

export class BooleanFieldVM extends FieldVM implements IBooleanField {
  fieldType: FieldType.BOOLEAN = FieldType.BOOLEAN;
  _value = false;
  setValue(newValue: boolean) {
    this._value = newValue;
  }
  get value() {
    return this._value;
  }
  isValid() {
    return true;
  }

  constructor(props: FieldConstructorProps) {
    super(props);
    makeObservable(this, {
      _value: observable,
      value: computed,
    });
  }
}
