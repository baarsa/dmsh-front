import NumericInput from "react-numeric-input";
import { createCn } from "../../../../utils";
import "./HoursInput.css";

type Props = {
  value: number; // целое количество получасов
  onChange: (value: number) => void;
  label: string;
  isDisabled?: boolean;
};

const cn = createCn("hours-input");

export const HoursInput = ({
  value,
  onChange,
  label,
  isDisabled = false,
}: Props) => {
  return (
    <div className={cn()}>
      <div className={cn("label")}>{label}</div>
      <NumericInput
        disabled={isDisabled}
        value={value / 2}
        onChange={(value) => {
          if (value !== null) {
            onChange(Math.round(value * 2));
          }
        }}
        strict
        precision={1}
        step={0.5}
        min={0}
        snap
      />
    </div>
  );
};
