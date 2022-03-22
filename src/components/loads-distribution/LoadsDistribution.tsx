import { LoadsDistributionVM } from "../../view-models/pages/LoadsDistributionVM";
import { createCn } from "../../utils";
import { LinkField } from "../fields/link-field/LinkField";
import "./LoadsDistribution.css";
import { observer } from "mobx-react-lite";

type Props = {
  vm: LoadsDistributionVM;
};

const cn = createCn("loads-distribution");

export const LoadsDistribution = observer(({ vm }: Props) => {
  return (
    <div className={cn()}>
      {vm.filteredPupilItems.map((item) => (
        <div key={item.name}>
          {item.name},{item.year + 1} класс
          <div>
            {item.planItems.map((planItem) => (
              <div key={planItem.subjectName}>
                {planItem.subjectName}
                {planItem.halfHours}
                <LinkField field={planItem.teacherField} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});
