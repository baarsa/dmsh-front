import { FieldType } from "./FieldType";
import { IField } from "./IField";

export interface IStringField extends IField {
  value: string;
  setValue(newValue: string): void;
  fieldType: FieldType.STRING;
}
