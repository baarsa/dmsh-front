import { ILinkField } from "../../../view-models/fields/ILinkField";
import { observer } from "mobx-react-lite";
import { Select } from "../../select/Select";

export const LinkField = observer((props: { field: ILinkField }) => (
  <Select
    error={!props.field.isValid()}
    disabled={props.field.isDisabled}
    label={props.field.label}
    value={props.field.getValueId() ?? undefined} // display loader for isLoading
    onChange={(value) => props.field.setValue(value)}
    options={props.field.options.map(({ id, text }) => ({ value: id, text }))}
  />
));
