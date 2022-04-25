import { LoadsInfoVM } from "../../view-models/LoadsInfoVM";
import Icon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Collapse } from "@mui/material";
import { createCn } from "../../utils";
import "./LoadsInfo.css";
import { observer } from "mobx-react-lite";
import CheckIcon from '@mui/icons-material/Check';

type Props = {
  vm: LoadsInfoVM;
};

const cn = createCn("loads-info");

export const LoadsInfo = observer(({ vm }: Props) => {
  return (
    <div className={cn({ open: vm.isOpen })}>
      <div
        className={cn("top")}
        onClick={() => {
          vm.isOpen = !vm.isOpen;
        }}
      >
          <div className={cn('top-left')}>
        {vm.title} { vm.isDistributed ? <CheckIcon /> : "(есть нераспределенная нагрузка)" }
          </div>
        <Icon className={cn("icon")} />
      </div>
      <Collapse in={vm.isOpen}>
        <div className={cn("content")}>
          {vm.items.map((item, i) => (
            <div className={cn("load-item")} key={i}>
              {item.text}: {item.assignedCount} / {item.totalCount} мин. { item.assignedCount >= item.totalCount && <CheckIcon /> }
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  );
});
