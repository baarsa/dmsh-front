import { ILinkField } from "../fields/ILinkField";
import { FieldUnion } from "../fields/FieldUnion";
import { IStringField } from "../fields/IStringField";
import { IBooleanField } from "../fields/IBooleanField";
import { makeAutoObservable } from "mobx";

type FormMode = "view" | "edit";

type PossibleField<T> = T extends string
  ? IStringField
  : T extends boolean
  ? IBooleanField
  : T extends number
  ? ILinkField
  : never;

type RelevantFields<T extends Record<string, unknown>> = {
  [K in keyof T]: PossibleField<T[K]>;
};

export interface IFormModel {
  mode: FormMode;
  title: string;
  getFields(): FieldUnion[];
  isValid(): boolean;
  handleSubmit(): Promise<number>;
  handleCancel(): void;
}

export class FormModel<T extends Record<string, unknown>>
  implements IFormModel
{
  // parameter - shape of entity instantiation
  mode: FormMode;
  fields: RelevantFields<T>;
  getFields() {
    return Object.values(this.fields);
  }
  title: string;
  private mapFieldsToProps: (fields: RelevantFields<T>) => T;
  isValid(): boolean {
    return Object.values(this.fields).reduce<boolean>(
      (acc, field) => acc && (field.isDisabled || field.isValid()),
      true
    );
    // add to field prop isNecessary
  }
  private readonly submitHandler: (data: T) => Promise<number>;
  private readonly cancelHandler: () => void;
  async handleSubmit() {
    return this.submitHandler(this.mapFieldsToProps(this.fields));
  }
  handleCancel() {
    this.cancelHandler();
  }
  constructor(props: {
    title: string;
    mode: FormMode;
    fields: RelevantFields<T>;
    mapFieldsToProps: (fields: RelevantFields<T>) => T;
    submitHandler: (data: T) => Promise<number>;
    cancelHandler: () => void;
  }) {
    this.title = props.title;
    this.mode = props.mode;
    this.fields = props.fields;
    this.mapFieldsToProps = props.mapFieldsToProps;
    this.submitHandler = props.submitHandler;
    this.cancelHandler = props.cancelHandler;
    makeAutoObservable(this);
  }
}
