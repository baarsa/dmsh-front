import { IBooleanField } from "../../view-models/fields/IBooleanField";
import { observer } from "mobx-react-lite";

export const BooleanField = observer((props: { field: IBooleanField }) => (
  <input
    type="checkbox"
    checked={props.field.value}
    onChange={(e) => props.field.setValue(e.target.checked)}
  />
));
