import { FieldType } from "./FieldType";
import { IField } from "./IField";
import { Option } from "./Option";

export interface ILinkField extends IField {
  setValue(id: number): void;
  options: Option[];
  getValueText(): string;
  getValueId(): number | null;
  fieldType: FieldType.LINK;
}
