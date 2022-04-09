import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MaterialSelect,
} from "@mui/material";

type Props = {
  disabled?: boolean;
  label: string;
  values: number[];
  onChange: (values: number[]) => void;
  options: Array<{ text: string; value: number }>;
  error?: boolean;
  multiple?: boolean;
};

export const Select = ({
  label,
  values,
  onChange,
  options,
  disabled = false,
  error = false,
  multiple = false,
}: Props) => (
  <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
    <InputLabel shrink={true}>{label}</InputLabel>
    <MaterialSelect
      multiple={multiple}
      disabled={disabled}
      error={error}
      notched={true}
      label={label}
      value={values}
      onChange={(e) =>
        onChange(
          Array.isArray(e.target.value)
            ? e.target.value.map((v) => Number(v))
            : [Number(e.target.value)]
        )
      }
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.text}
        </MenuItem>
      ))}
    </MaterialSelect>
  </FormControl>
);
