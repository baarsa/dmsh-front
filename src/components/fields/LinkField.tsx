import { ILinkField } from "../../view-models/fields/ILinkField";

export const LinkField = (props: { field: ILinkField }) => (
  <select
    value={props.field.getValueId()}
    onChange={(e) => props.field.setValue(Number(e.target.value))}
  >
    {props.field.getOptions().map((option) => (
      <option value={option.id}>{option.text}</option>
    ))}
  </select>
);
