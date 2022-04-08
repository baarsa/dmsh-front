import { FieldType } from "./FieldType";
import { IFormModel } from "../forms/FormModel";

export interface IField {
  label: string;
  isDisabled: boolean;
  isValid(): boolean;
  isVisible: boolean;
  fieldType: FieldType;
  parentForm: IFormModel | null;
}
