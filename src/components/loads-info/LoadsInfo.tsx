import { LoadsInfoVM } from "../../view-models/LoadsInfoVM";
import Icon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { Collapse } from "@mui/material";
import { createCn } from "../../utils";
import "./LoadsInfo.css";
import { observer } from "mobx-react-lite";

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
        {vm.title}
        <Icon className={cn("icon")} />
      </div>
      <Collapse in={vm.isOpen}>
        <div className={cn("content")}>
          {vm.items.map((item, i) => (
            <div key={i}>
              {item.text}: {item.assignedCount} / {item.totalCount}
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  );
});
