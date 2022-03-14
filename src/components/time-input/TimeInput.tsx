import TimeField from "react-simple-timefield";
import { getTimeText, parseTimeText } from "../../utils";
import { Input } from "@mui/material";

type Props = {
  value: number; // время в минутах
  onChange: (value: number) => void;
  className?: string;
};

export const TimeInput = ({ value, onChange, className }: Props) => {
  return (
    <TimeField
      input={<Input className={className} />}
      value={getTimeText(value)}
      onChange={(e) => onChange(parseTimeText(e.target.value))}
    />
  );
};
