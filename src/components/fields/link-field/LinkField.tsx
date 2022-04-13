import { ILinkField } from "../../../view-models/fields/ILinkField";
import { observer } from "mobx-react-lite";
import { Select } from "../../select/Select";

export const LinkField = observer((props: { field: ILinkField }) => (
  <div>
    <Select
      multiple={props.field.isMultiple}
      error={!props.field.isValid()}
      disabled={props.field.isDisabled}
      label={props.field.label}
      values={props.field.getValuesIds()} // display loader for isLoading
      onChange={(values) => props.field.setValues(values)}
      options={props.field.options.map(({ id, text }) => ({ value: id, text }))}
    />
    {props.field.showValuesList &&
      props.field.getValuesIds().map((id) => {
        const value = props.field.options.find((item) => item.id === id);
        return <div key={id}>{value?.text}</div>;
      })}
  </div>
));
