import { LoadsDistributionVM } from "../../view-models/pages/LoadsDistributionVM";
import { createCn, formatHalfHours } from "../../utils";
import { LinkField } from "../fields/link-field/LinkField";
import "./LoadsDistribution.css";
import { observer } from "mobx-react-lite";
import { Paginate } from "../paginate/Paginate";
import { Select } from "../select/Select";
import { SpinnerOnCenter } from "../spinner-on-center/SpinnerOnCenter";

type Props = {
  vm: LoadsDistributionVM;
};

const cn = createCn("loads-distribution");

export const LoadsDistribution = observer(({ vm }: Props) => {
  return (
    <div className={cn()}>
      <div className={cn("controls")}>
          <div className={cn("select")}>
            <Select
              label={"Год обучения"}
              onChange={(values) => (vm.selectedYear = values[0])}
              options={vm.yearOptions}
              values={[vm.selectedYear]}
            />
          </div>
        {vm.pageCount > 1 && (
          <Paginate
            pageCount={vm.pageCount}
            currentPage={vm.currentPageNumber}
            onPageChange={(selected) => (vm.currentPage = selected)}
          />
        )}
      </div>
      {vm.isLoading && <SpinnerOnCenter />}
      {vm.pupilItemsOnPage.map((item) => (
        <div key={item.name} className={cn("pupil-item")}>
          <div className={cn("pupil-title")}>
            {item.name}, {item.year} класс
          </div>
          <div>
            {item.planItems.map((planItem) => (
              <div key={planItem.subjectName} className={cn("subject-item")}>
                <div
                  className={cn("subject-title", {
                    special: planItem.isSpecial,
                  })}
                  title={planItem.isSpecial ? "Специальность" : undefined}
                >
                  {planItem.subjectName}, {formatHalfHours(planItem.halfHours)}
                </div>
                <div className={cn("teacher-field")}>
                  <LinkField field={planItem.teacherField} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className={cn("bottom-controls")}>
        {vm.pageCount > 1 && (
          <Paginate
            pageCount={vm.pageCount}
            currentPage={vm.currentPageNumber}
            onPageChange={(selected) => (vm.currentPage = selected)}
          />
        )}
      </div>
    </div>
  );
});
