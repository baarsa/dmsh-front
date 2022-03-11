import TimeField from "react-simple-timefield";
import { getTimeText, parseTimeText } from "../../utils";

type Props = {
  value: number; // время в минутах
  onChange: (value: number) => void;
};

export const TimeInput = ({ value, onChange }: Props) => {
  return (
    <TimeField
      value={getTimeText(value)}
      onChange={(e) => onChange(parseTimeText(e.target.value))}
    />
  );
};
