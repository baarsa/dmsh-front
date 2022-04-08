import { IStringField } from "../../view-models/fields/IStringField";
import { observer } from "mobx-react-lite";
import { TextField } from "@mui/material";

type Props = {
  field: IStringField;
};

export const StringField = observer(({ field }: Props) => (
  <TextField
    disabled={field.isDisabled}
    error={!field.isValid()}
    type="text"
    label={field.label}
    value={field.value}
    onChange={(e) => (field.value = e.target.value)}
  />
));
