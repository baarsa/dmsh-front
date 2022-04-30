import { Form } from "../form/Form";
import { ScheduleFormVM } from "../../../view-models/forms/ScheduleFormVM";
import { LinkField } from "../../fields/link-field/LinkField";
import NumericInput from "react-numeric-input";
import { observer } from "mobx-react-lite";
import { Button } from "../../button/Button";
import { createCn } from "../../../utils";
import "./ScheduleForm.css";
import { CrossButton } from "../../cross-button/CrossButton";

type Props = {
  vm: ScheduleFormVM;
  onSubmit?: (newId: number) => void;
  onCancel?: () => void;
};

const cn = createCn("schedule-form");

export const ScheduleForm = observer(({ vm, onSubmit, onCancel }: Props) => {
  return (
    <Form form={vm} onSubmit={onSubmit} onCancel={onCancel}>
      <div className={cn()}>
        {vm.pupilsYears.map(({ id, name, year }) => (
          <div className={cn("pupil-item")} key={id}>
            <div>{name}</div>
            <div className={cn("pupil-item-right")}>
              {year} класс
              {vm.mode === "edit" && (
                <CrossButton
                  title={"Удалить учащегося из расписания"}
                  onClick={() => vm.removePupil(id)}
                />
              )}
            </div>
          </div>
        ))}
        {vm.mode === "edit" && (
          <>
            <div className={cn("add-controls")}>
              <LinkField className={cn("pupil-field")} field={vm.pupilField} />
              <div>
                Класс:&nbsp;
                <NumericInput
                  disabled={vm.isYearSelectDisabled}
                  style={{ input: { width: "40px" } }}
                  min={1}
                  max={vm.maxYear}
                  value={vm.currentYear}
                  onChange={(value) => {
                    if (value !== null) {
                      vm.currentYear = value;
                    }
                  }}
                />
              </div>
            </div>
            <Button disabled={!vm.canAddPupil} onClick={() => vm.addPupil()}>
              Добавить учащегося
            </Button>
          </>
        )}
      </div>
    </Form>
  );
});
