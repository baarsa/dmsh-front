import { YearPlansControlVM } from "../../../view-models/forms/YearPlansControlVM";
import { LinkField } from "../../fields/link-field/LinkField";
import { createCn, formatHalfHours } from "../../../utils";
import CloseIcon from "@mui/icons-material/Close";
import { observer } from "mobx-react-lite";
import { HoursInput } from "./hours-input/HoursInput";
import { Button } from "../../button/Button";

type Props = {
  vm: YearPlansControlVM;
};

const cn = createCn("year-plans-control");

export const YearPlansControl = observer(({ vm }: Props) => {
  return (
    <div className={cn()}>
      <div className={cn("title")}>Годовые планы</div>
      {vm.yearPlans.map((yearPlan, i) => (
        <div key={i} className={cn("year-plan")}>
          <div>Год {i + 1}</div>
          {vm.mode === "edit" && (
            <CloseIcon
              className={cn("cross")}
              onClick={() => vm.removeYearPlan(i)}
            />
          )}
          <HoursInput
            isDisabled={vm.mode === "view"}
            label={"Часы специальности"}
            value={yearPlan.specialityHalfHours}
            onChange={(value) => {
              yearPlan.specialityHalfHours = value;
            }}
          />
          {vm.mode === "edit" && (
            <>
              <LinkField field={yearPlan.subjectField} />
              <HoursInput
                label={"Часы по предмету"}
                value={yearPlan.newSubjectHalfHours}
                onChange={(value) => {
                  yearPlan.newSubjectHalfHours = value;
                }}
              />
              <Button
                disabled={!yearPlan.canAddSubject}
                onClick={() => yearPlan.addCommonSubject()}
              >
                Добавить предмет
              </Button>
            </>
          )}
          {yearPlan.commonSubjects.map((subject, j) => (
            <div key={j}>
              {vm.mode === "edit" && (
                <CloseIcon
                  className={cn("cross")}
                  onClick={() => yearPlan.removeCommonSubject(j)}
                />
              )}
              {subject.subjectName}
              {formatHalfHours(subject.halfHours)}
            </div>
          ))}
        </div>
      ))}
      {vm.mode === "edit" && (
        <Button onClick={() => vm.addYearPlan()}>Добавить год обучения</Button>
      )}
    </div>
  );
});
