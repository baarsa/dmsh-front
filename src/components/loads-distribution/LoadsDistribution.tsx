import { LoadsDistributionVM } from "../../view-models/pages/LoadsDistributionVM";
import { createCn, formatHalfHours } from "../../utils";
import { LinkField } from "../fields/link-field/LinkField";
import "./LoadsDistribution.css";
import { observer } from "mobx-react-lite";
import { Paginate } from "../paginate/Paginate";
import { Select } from "../select/Select";

type Props = {
  vm: LoadsDistributionVM;
};

const cn = createCn("loads-distribution");

export const LoadsDistribution = observer(({ vm }: Props) => {
  return (
    <div className={cn()}>
      <div className={cn("controls")}>
        <Paginate
          pageCount={vm.pageCount}
          currentPage={vm.currentPageNumber}
          onPageChange={(selected) => (vm.currentPage = selected)}
        />
        <Select
          label={"Год обучения"}
          onChange={(value) => (vm.selectedYear = value)}
          options={vm.yearOptions}
          value={vm.selectedYear}
        />
      </div>
      {vm.pupilItemsOnPage.map((item) => (
        <div key={item.name} className={cn("pupil-item")}>
          <div className={cn("pupil-title")}>
            {item.name}, {item.year + 1} класс
          </div>
          <div>
            {item.planItems.map((planItem) => (
              <div key={planItem.subjectName} className={cn("subject-item")}>
                <div className={cn("subject-title")}>
                  {planItem.subjectName}, {formatHalfHours(planItem.halfHours)}
                </div>
                <LinkField field={planItem.teacherField} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});
