import { ILinkField } from "../fields/ILinkField";
import { FieldUnion } from "../fields/FieldUnion";
import { IStringField } from "../fields/IStringField";
import { IBooleanField } from "../fields/IBooleanField";
import { makeAutoObservable } from "mobx";

export type FormMode = "view" | "edit";

type PossibleField<T> = T extends string
  ? IStringField
  : T extends boolean
  ? IBooleanField
  : T extends number | number[]
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
  handleDelete(): void;
}

export class FormModel<T extends Record<string, unknown>>
  implements IFormModel
{
  mode: FormMode;
  // parameter - shape of entity instantiation
  fields: RelevantFields<T>;
  getFields() {
    return Object.values(this.fields);
  }
  get mappedFields() {
    return this.mapFieldsToProps(this.fields);
  }
  title: string;
  private readonly mapFieldsToProps: (fields: RelevantFields<T>) => T;
  isValid(): boolean {
    return Object.values(this.fields).reduce<boolean>(
      (acc, field) => acc && (field.isDisabled || field.isValid()),
      true
    );
    // add to field prop isNecessary
  }
  private readonly submitHandler?: (data: T) => Promise<number>;
  private readonly cancelHandler?: () => void;
  private readonly deleteHandler?: () => void;
  async handleSubmit() {
    if (this.submitHandler === undefined) {
      throw new Error("Обработчик формы не определен");
    }
    return this.submitHandler(this.mapFieldsToProps(this.fields));
  }
  handleCancel() {
    if (this.cancelHandler !== undefined) {
      this.cancelHandler();
    }
  }
  handleDelete() {
    if (this.deleteHandler !== undefined) {
      this.deleteHandler();
    }
  }
  constructor(props: {
    title: string;
    mode: FormMode;
    fields: RelevantFields<T>;
    mapFieldsToProps: (fields: RelevantFields<T>) => T;
    submitHandler?: (data: T) => Promise<number>;
    deleteHandler?: () => Promise<void>;
    cancelHandler?: () => void;
  }) {
    this.title = props.title;
    this.mode = props.mode;
    Object.values(props.fields).forEach((field) => (field.parentForm = this));
    this.fields = props.fields;
    this.mapFieldsToProps = props.mapFieldsToProps;
    this.submitHandler = props.submitHandler;
    this.cancelHandler = props.cancelHandler;
    this.deleteHandler = props.deleteHandler;
    makeAutoObservable(this);
  }
}
