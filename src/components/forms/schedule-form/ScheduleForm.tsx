import { Form } from "../form/Form";
import { ScheduleFormVM } from "../../../view-models/forms/ScheduleFormVM";
import { LinkField } from "../../fields/link-field/LinkField";
import NumericInput from "react-numeric-input";
import CloseIcon from "@mui/icons-material/Close";
import { observer } from "mobx-react-lite";
import { Button } from "../../button/Button";

type Props = {
  vm: ScheduleFormVM;
  onSubmit?: (newId: number) => void;
  onCancel?: () => void;
};

export const ScheduleForm = observer(({ vm, onSubmit, onCancel }: Props) => {
  return (
    <Form form={vm} onSubmit={onSubmit} onCancel={onCancel}>
      {vm.pupilsYears.map(({ id, name, year }) => (
        <div key={id}>
          {name} - {year}
          {vm.mode === "edit" && (
            <CloseIcon onClick={() => vm.removePupil(id)} />
          )}
        </div>
      ))}
      {vm.mode === "edit" && (
        <div>
          <LinkField field={vm.pupilField} />
          <NumericInput
            disabled={vm.isYearSelectDisabled}
            min={1}
            max={vm.maxYear}
            value={vm.currentYear}
            onChange={(value) => {
              if (value !== null) {
                vm.currentYear = value;
              }
            }}
          />
          <Button disabled={!vm.canAddPupil} onClick={() => vm.addPupil()}>
            Добавить учащегося
          </Button>
        </div>
      )}
    </Form>
  );
});
