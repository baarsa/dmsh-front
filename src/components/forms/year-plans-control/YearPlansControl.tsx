import { YearPlansControlVM } from "../../../view-models/forms/YearPlansControlVM";
import { LinkField } from "../../fields/link-field/LinkField";
import { createCn, formatHalfHours } from "../../../utils";
import CloseIcon from "@mui/icons-material/Close";
import { observer } from "mobx-react-lite";
import { HoursInput } from "./hours-input/HoursInput";
import { Button } from "../../button/Button";
import "./YearPlansControl.css";

type Props = {
  vm: YearPlansControlVM;
};

const cn = createCn("year-plans-control");

export const YearPlansControl = observer(({ vm }: Props) => {
  return (
    <div className={cn()}>
      <div className={cn("title")}>Годовые планы</div>
      <div className={cn("items")}>
        {vm.yearPlans.map((yearPlan, i) => (
          <div key={i} className={cn("year-plan")}>
            <div className={cn("year-plan-title")}>
              Год {i + 1}
              {vm.mode === "edit" && i === vm.yearPlans.length - 1 && (
                <CloseIcon
                  className={cn("cross")}
                  onClick={() => vm.removeYearPlan(i)}
                />
              )}
            </div>
            <HoursInput
              isDisabled={vm.mode === "view"}
              label={"Часы специальности"}
              value={yearPlan.specialityHalfHours}
              onChange={(value) => {
                yearPlan.specialityHalfHours = value;
              }}
            />
            {yearPlan.commonSubjects.map((subject, j) => (
              <div className={cn("subject-item")} key={j}>
                <div>
                  {subject.subjectName}:&nbsp;
                  {formatHalfHours(subject.halfHours)}
                </div>
                {vm.mode === "edit" && (
                  <CloseIcon
                    className={cn("cross")}
                    onClick={() => yearPlan.removeCommonSubject(j)}
                  />
                )}
              </div>
            ))}
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
          </div>
        ))}
      </div>
      {vm.mode === "edit" && (
        <Button className={cn("add-year")} onClick={() => vm.addYearPlan()}>
          Добавить год обучения
        </Button>
      )}
    </div>
  );
});
