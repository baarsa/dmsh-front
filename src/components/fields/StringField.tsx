import { IStringField } from "../../view-models/fields/IStringField";

export const StringField = (props: { field: IStringField }) => (
  <input
    type="text"
    value={props.field.value}
    onChange={(e) => props.field.setValue(e.target.value)}
  />
);
