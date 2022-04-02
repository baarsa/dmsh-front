import { ConflictsInfoVM } from "../../view-models/ConflictsInfoVM";
import Icon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Collapse } from "@mui/material";
import { createCn } from "../../utils";
import "./ConflictsInfo.css";
import { observer } from "mobx-react-lite";

type Props = {
  vm: ConflictsInfoVM;
};

const cn = createCn("conflicts-info");

export const ConflictsInfo = observer(({ vm }: Props) => {
  return (
    <div className={cn({ open: vm.isOpen })}>
      <div
        className={cn("top")}
        onClick={() => {
            if (vm.items.length === 0) {
                return;
            }
          vm.isOpen = !vm.isOpen;
        }}
      >
          { vm.items.length > 0 ? `Список конфликтов (${vm.items.length})` : 'Конфликты отсутствуют'}
          { vm.items.length > 0 && <Icon className={cn("icon")} /> }
      </div>
      <Collapse in={vm.isOpen}>
        <div className={cn("content")}>
          {vm.items.map((item, i) => (
            <div key={i}>
              {item.text} в{" "}
              <span
                className={cn("weekday")}
                onClick={() => vm.handleWeekDayClick(item.day)}
              >
                {item.dayText}
              </span>
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  );
});
