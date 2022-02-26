import { FieldType } from "./FieldType";
import { IField } from "./IField";

export interface IBooleanField extends IField {
  value: boolean;
  setValue(newValue: boolean): void;
  fieldType: FieldType.BOOLEAN;
}
