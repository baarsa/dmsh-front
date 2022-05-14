import { observer } from "mobx-react-lite";
import { TimeManagementVM } from "../../view-models/pages/TimeManagementViewModel";
import { LinkField } from "../fields/link-field/LinkField";
import { Timeline } from "../timeline/Timeline";
import { ConfirmExtraEmployment } from "../ConfirmExtraEmployment/ConfirmExtraEmployment";
import { ConfirmLesson } from "../ConfirmLesson/ConfirmLesson";
import { createCn } from "../../utils";
import "./time-management.css";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Select } from "../select/Select";
import { ConfirmAction } from "../confirm-action/ConfirmAction";
import { ConfirmSpanChange } from "../confirm-span-change/ConfirmSpanChange";
import { LoadsInfo } from "../loads-info/LoadsInfo";
import { ConflictsInfo } from "../conflicts-info/ConflictsInfo";
import { SpinnerOnCenter } from "../spinner-on-center/SpinnerOnCenter";
import {ConfirmAssistance} from "../confirm-assistance/ConfirmAssistance";

const cn = createCn("time-management");

type Props = {
  vm: TimeManagementVM;
};

export const TimeManagement = observer(({ vm }: Props) => {
  return (
    <div className={cn()}>
      {vm.isLoading && <SpinnerOnCenter />}
      {!vm.isSynchronized && <SpinnerOnCenter withBlur={false} />}
      <LoadsInfo vm={vm.loadsInfo} />
      <ConflictsInfo vm={vm.conflictsInfo} />
      <div className={cn("controls")}>
        <Select
          label="День недели"
          values={[vm.selectedDay]}
          onChange={(values) => vm.handleDayChange(values[0])}
          options={vm.dayOptions}
        />
        <LinkField field={vm.teacherField} />
        <RadioGroup
          className={cn("taker-radio")}
          value={vm.lessonTakerType}
          onChange={(e) => {
            vm.lessonTakerType = e.target.value as "pupil" | "group";
          }}
        >
          <FormControlLabel value="pupil" control={<Radio />} label="Ученик" />
          <FormControlLabel value="group" control={<Radio />} label="Группа" />
        </RadioGroup>
        {vm.lessonTakerType === "pupil" && <LinkField field={vm.pupilField} />}
        {vm.lessonTakerType === "group" && <LinkField field={vm.groupField} />}
      </div>
      <div className={cn("timeline-container")}>
        <div className={cn("timeline-label")}>
          Преподаватель {vm.teacherField.value?.name}
        </div>
        <Timeline vm={vm.teacherTimeline} />
      </div>
      <div className={cn("timeline-container")}>
        <div className={cn("timeline-label")}>
          Преподаватель {vm.teacherField.value?.name} и{" "}
          {vm.lessonTakerType === "pupil"
            ? `учащийся ${vm.pupilField.value?.name}`
            : `группа "${vm.groupField.value?.name}"`}
        </div>
        <Timeline vm={vm.commonTimeline} />
      </div>
      <div className={cn("timeline-container")}>
        <div className={cn("timeline-label")}>
          {vm.lessonTakerType === "pupil"
            ? `Учащийся ${vm.pupilField.value?.name}`
            : `Группа "${vm.groupField.value?.name}"`}
        </div>
        <Timeline vm={vm.takerTimeline} />
      </div>
      {vm.confirmExtraEmployment && (
        <ConfirmExtraEmployment vm={vm.confirmExtraEmployment} />
      )}
      {vm.confirmLesson && <ConfirmLesson vm={vm.confirmLesson} />}
      {vm.confirmAction && <ConfirmAction vm={vm.confirmAction} />}
      {vm.confirmSpanChange && <ConfirmSpanChange vm={vm.confirmSpanChange} />}
      {vm.confirmAssistance && <ConfirmAssistance vm={vm.confirmAssistance} />}
    </div>
  );
});
