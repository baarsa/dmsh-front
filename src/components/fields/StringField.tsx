import { IStringField } from "../../view-models/fields/IStringField";
import { observer } from "mobx-react-lite";
import { TextField } from "@mui/material";

type Props = {
  field: IStringField;
  type?: string;
};

export const StringField = observer(({ field, type = "text" }: Props) => {
  return (
    <TextField
      fullWidth
      disabled={field.isDisabled}
      error={!field.isValid()}
      type={type}
      label={field.label}
      value={field.value}
      onChange={(e) => (field.value = e.target.value)}
    />
  );
});
