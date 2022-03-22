import { FieldType } from "./FieldType";
import { IField } from "./IField";
import { Option } from "./Option";

export interface ILinkField extends IField {
  setValue(id: number): void;
  options: Option[];
  getValueId(): number;
  fieldType: FieldType.LINK;
}
