import { ILinkField } from "../../view-models/fields/ILinkField";
import {observer} from "mobx-react-lite";

export const LinkField = observer((props: { field: ILinkField }) => (
  <select
    value={props.field.getValueId() ?? undefined} // display loader for isLoading
    onChange={(e) => props.field.setValue(Number(e.target.value))}
  >
    {props.field.options.map((option) => (
      <option key={option.id} value={option.id}>{option.text}</option>
    ))}
  </select>
));
