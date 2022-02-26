import { FieldVM } from "./Field";
import { FieldType } from "./FieldType";

// add constructors
export class StringFieldVM extends FieldVM {
  fieldType = FieldType.STRING;
  value: string = "";
  isValid() {
    return this.value.length > 0;
  }
}
