import { FieldType } from "../../view-models/fields/FieldType";
import { IBooleanField } from "../../view-models/fields/IBooleanField";
import { ILinkField } from "../../view-models/fields/ILinkField";
import { IStringField } from "../../view-models/fields/IStringField";
import { StringField } from "./StringField";
import { BooleanField } from "./BooleanField";
import { LinkField } from "./link-field/LinkField";
import { createCn } from "../../utils";
import "./Field.css";

const cn = createCn("field");

export const Field = (props: {
  field: IBooleanField | IStringField | ILinkField;
}) => (
  <div className={cn()}>
    {props.field.fieldType === FieldType.BOOLEAN && (
      <BooleanField field={props.field} />
    )}
    {props.field.fieldType === FieldType.STRING && (
      <StringField field={props.field} />
    )}
    {props.field.fieldType === FieldType.LINK && (
      <LinkField field={props.field} />
    )}
  </div>
);
