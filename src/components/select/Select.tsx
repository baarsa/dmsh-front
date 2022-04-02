import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MaterialSelect,
} from "@mui/material";

type Props = {
  disabled?: boolean;
  label: string;
  value?: number;
  onChange: (value: number) => void;
  options: Array<{ text: string; value: number }>;
  error?: boolean;
};

export const Select = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  error = false,
}: Props) => (
  <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
    <InputLabel shrink={true}>{label}</InputLabel>
    <MaterialSelect
      disabled={disabled}
      error={error}
      notched={true}
      label={label}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.text}
        </MenuItem>
      ))}
    </MaterialSelect>
  </FormControl>
);
