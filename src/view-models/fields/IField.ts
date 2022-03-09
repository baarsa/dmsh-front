import { FieldType } from "./FieldType";

export interface IField {
  getLabel(): string;
  isDisabled: boolean;
  isValid(): boolean;
  fieldType: FieldType;
}
