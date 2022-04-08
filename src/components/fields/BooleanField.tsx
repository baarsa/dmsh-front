import { IBooleanField } from "../../view-models/fields/IBooleanField";
import { observer } from "mobx-react-lite";
import { Checkbox } from "@mui/material";

export const BooleanField = observer((props: { field: IBooleanField }) => (
  <Checkbox
    disabled={props.field.isDisabled}
    checked={props.field.value}
    onChange={(e) => props.field.setValue(e.target.checked)}
  />
));
