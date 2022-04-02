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

const cn = createCn("time-management");

export const TimeManagement = observer((props: { vm: TimeManagementVM }) => {
  return (
    <div className={cn()}>
      <LoadsInfo vm={props.vm.loadsInfo} />
      <ConflictsInfo vm={props.vm.conflictsInfo} />
      <div className={cn("controls")}>
        <Select
          label="День недели"
          value={props.vm.selectedDay}
          onChange={(value) => props.vm.handleDayChange(value)}
          options={props.vm.dayOptions}
        />
        <LinkField field={props.vm.teacherField} />
        <RadioGroup
          className={cn("taker-radio")}
          value={props.vm.lessonTakerType}
          onChange={(e) => {
            props.vm.lessonTakerType = e.target.value as "pupil" | "group";
          }}
        >
          <FormControlLabel value="pupil" control={<Radio />} label="Ученик" />
          <FormControlLabel value="group" control={<Radio />} label="Группа" />
        </RadioGroup>
        {props.vm.lessonTakerType === "pupil" && (
          <LinkField field={props.vm.pupilField} />
        )}
        {props.vm.lessonTakerType === "group" && (
          <LinkField field={props.vm.groupField} />
        )}
      </div>
      <Timeline vm={props.vm.teacherTimeline} className={cn("timeline")} />
      <Timeline vm={props.vm.commonTimeline} className={cn("timeline")} />
      <Timeline vm={props.vm.takerTimeline} className={cn("timeline")} />
      {props.vm.confirmExtraEmployment && (
        <ConfirmExtraEmployment vm={props.vm.confirmExtraEmployment} />
      )}
      {props.vm.confirmLesson && <ConfirmLesson vm={props.vm.confirmLesson} />}
      {props.vm.confirmAction && <ConfirmAction vm={props.vm.confirmAction} />}
      {props.vm.confirmSpanChange && (
        <ConfirmSpanChange vm={props.vm.confirmSpanChange} />
      )}
    </div>
  );
});
