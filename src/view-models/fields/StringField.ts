import { FieldConstructorProps, FieldVM } from "./Field";
import { FieldType } from "./FieldType";
import { computed, makeObservable, observable } from "mobx";

// add constructors
export class StringFieldVM extends FieldVM {
  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }
  fieldType: FieldType.STRING = FieldType.STRING;
  _value = "";
  isValid() {
    return this._value.length > 0;
  }

  constructor(props: FieldConstructorProps, initValue?: string) {
    super(props);
    if (initValue !== undefined) {
      this._value = initValue;
    }
    makeObservable(this, {
      _value: observable,
      value: computed,
    });
  }
}
