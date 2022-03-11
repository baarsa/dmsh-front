import { IStringField } from "../../view-models/fields/IStringField";
import { observer } from "mobx-react-lite";

export const StringField = observer((props: { field: IStringField }) => (
  <input
    type="text"
    value={props.field.value}
    onChange={(e) => (props.field.value = e.target.value)}
  />
));
