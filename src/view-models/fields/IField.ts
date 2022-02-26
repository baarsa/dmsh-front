import { FieldType } from "./FieldType";

export interface IField {
  getLabel(): string;
  isEnabled(): boolean;
  isValid(): boolean;
  fieldType: FieldType;
}
