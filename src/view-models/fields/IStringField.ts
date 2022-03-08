import { FieldType } from "./FieldType";
import { IField } from "./IField";

export interface IStringField extends IField {
  value: string;
  fieldType: FieldType.STRING;
}
