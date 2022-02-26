import { FieldType } from "./FieldType";
import { IBooleanField } from "./IBooleanField";

export type FieldConstructorProps = {
  label: string;
  controllingField?: IBooleanField;
  isDisabled?: boolean;
};

export abstract class FieldVM {
  protected abstract fieldType: FieldType;
  abstract isValid(): boolean;
  protected controllingField: IBooleanField | null = null;
  private label: string;
  private isDisabled: boolean;
  getFieldType() {
    return this.fieldType;
  }
  isEnabled(): boolean {
    return (
      !this.isDisabled &&
      (this.controllingField === null || this.controllingField.value)
    );
  }
  getLabel() {
    return this.label;
  }
  constructor(props: FieldConstructorProps) {
    this.label = props.label;
    this.controllingField = props.controllingField ?? null;
    this.isDisabled = props.isDisabled ?? false;
  }
}
