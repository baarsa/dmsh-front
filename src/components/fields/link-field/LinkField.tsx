import { ILinkField } from "../../../view-models/fields/ILinkField";
import { observer } from "mobx-react-lite";
import { Select } from "../../select/Select";
import { createCn } from "../../../utils";
import "./LinkField.css";

const cn = createCn("link-field");

export const LinkField = observer(
  (props: { field: ILinkField; className?: string; contrast?: boolean }) => {
    const className =
      props.className === undefined ? cn() : `${cn()} ${props.className}`;
    return (
      <div className={className}>
        {!(props.field.showValuesList && props.field.isDisabled) && (
          <Select
            contrast={ props.contrast ?? false }
            multiple={props.field.isMultiple}
            error={!props.field.isValid()}
            disabled={props.field.isDisabled}
            label={props.field.label}
            values={props.field.getValuesIds()} // display loader for isLoading
            onChange={(values) => props.field.setValues(values)}
            options={props.field.options.map(({ id, text }) => ({
              value: id,
              text,
            }))}
          />
        )}
        {props.field.showValuesList && (
          <div className={cn("list")}>
            {props.field.getValuesIds().map((id) => {
              const value = props.field.options.find((item) => item.id === id);
              return <div key={id}>{value?.text}</div>;
            })}
          </div>
        )}
      </div>
    );
  }
);
