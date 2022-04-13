import { FieldType } from "./FieldType";
import { IField } from "./IField";
import { Option } from "./Option";

export interface ILinkField extends IField {
  isMultiple: boolean;
  showValuesList: boolean;
  setValues(ids: number[]): void;
  options: Option[];
  getValuesIds(): number[];
  fieldType: FieldType.LINK;
}
