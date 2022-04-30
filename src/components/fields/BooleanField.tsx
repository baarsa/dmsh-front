import { IBooleanField } from "../../view-models/fields/IBooleanField";
import { observer } from "mobx-react-lite";
import { Checkbox, FormControlLabel } from "@mui/material";

export const BooleanField = observer((props: { field: IBooleanField }) => (
  <FormControlLabel
    control={
      <Checkbox
        disabled={props.field.isDisabled}
        checked={props.field.value}
        onChange={(e) => props.field.setValue(e.target.checked)}
      />
    }
    label={props.field.label}
    sx={{ ml: 0 }}
  />
));
