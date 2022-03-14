import { FieldType } from "./FieldType";

export interface IField {
  label: string;
  isDisabled: boolean;
  isValid(): boolean;
  fieldType: FieldType;
}
