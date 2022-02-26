import { IBooleanField } from "../../view-models/fields/IBooleanField";

export const BooleanField = (props: { field: IBooleanField }) => (
  <input
    type="checkbox"
    checked={props.field.value}
    onChange={(e) => props.field.setValue(e.target.checked)}
  />
);
