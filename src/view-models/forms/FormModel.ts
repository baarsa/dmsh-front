import { ILinkField } from "../fields/ILinkField";
import { FieldUnion } from "../fields/FieldUnion";
import { IStringField } from "../fields/IStringField";
import { IBooleanField } from "../fields/IBooleanField";

type FormMode = "view" | "edit";

type PossibleField<T> = T extends string
  ? IStringField
  : T extends boolean
  ? IBooleanField
  : T extends number
  ? ILinkField
  : never;

// type that maps props type to dictionary of possible fields
type RelevantFields<T extends Record<string, unknown>> = {
  [K in keyof T]: PossibleField<T[K]>;
};

export interface IFormModel {
  mode: FormMode;
  title: string;
  getFields(): FieldUnion[];
  isValid(): boolean;
  handleSubmit(): void;
  handleCancel(): void;
}

// experiments
export class FormModel<T extends Record<string, unknown>>
  implements IFormModel {
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
      (acc, field) => acc && field.isValid(),
      true
    );
    // add to field prop isNecessary
  }
  private submitHandler: (data: T) => void;
  private cancelHandler: () => void;
  handleSubmit() {
    this.submitHandler(this.mapFieldsToProps(this.fields));
  }
  handleCancel() {
    this.cancelHandler();
  }
  constructor(props: {
    title: string;
    mode: FormMode;
    fields: RelevantFields<T>;
    mapFieldsToProps: (fields: RelevantFields<T>) => T;
    submitHandler: (data: T) => void;
    cancelHandler: () => void;
  }) {
    this.title = props.title;
    this.mode = props.mode;
    this.fields = props.fields;
    this.mapFieldsToProps = props.mapFieldsToProps;
    this.submitHandler = props.submitHandler;
    this.cancelHandler = props.cancelHandler;
  }
}
