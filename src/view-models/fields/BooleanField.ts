import { FieldVM } from "./Field";
import { FieldType } from "./FieldType";
import { IBooleanField } from "./IBooleanField";

export class BooleanFieldVM extends FieldVM implements IBooleanField {
  fieldType: FieldType.BOOLEAN = FieldType.BOOLEAN;
  value: boolean = false;
  setValue(newValue: boolean) {
    this.value = newValue;
  }
  isValid() {
    return true;
  }
}
