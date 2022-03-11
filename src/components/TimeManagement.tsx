import { observer } from "mobx-react-lite";
import { TimeManagementVM } from "../view-models/pages/TimeManagementViewModel";
import { LinkField } from "./fields/LinkField";
import { Timeline } from "./Timeline";
import { ConfirmExtraEmployment } from "./ConfirmExtraEmployment/ConfirmExtraEmployment";
import { ConfirmLesson } from "./ConfirmLesson/ConfirmLesson";

export const TimeManagement = observer((props: { vm: TimeManagementVM }) => {
  return (
    <div>
      <select
        value={props.vm.selectedDay}
        onChange={(e) => props.vm.handleDayChange(Number(e.target.value))}
      >
        {props.vm.dayOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
      <LinkField field={props.vm.teacherField} />
      <label>Ученик</label>
      <input
        type="radio"
        name="ltType"
        value="pupil"
        checked={props.vm.lessonTakerType === "pupil"}
        onChange={(e) => {
          if (e.target.checked) props.vm.lessonTakerType = "pupil";
        }}
      />
      <label>Группа</label>
      <input
        type="radio"
        name="ltType"
        value="group"
        onChange={(e) => {
          if (e.target.checked) props.vm.lessonTakerType = "group";
        }}
      />
      {props.vm.lessonTakerType === "pupil" && (
        <LinkField field={props.vm.pupilField} />
      )}
      {props.vm.lessonTakerType === "group" && (
        <LinkField field={props.vm.groupField} />
      )}
      <Timeline vm={props.vm.teacherTimeline} />
      <Timeline vm={props.vm.commonTimeline} />
      <Timeline vm={props.vm.takerTimeline} />
      {props.vm.confirmExtraEmployment && (
        <ConfirmExtraEmployment vm={props.vm.confirmExtraEmployment} />
      )}
      {props.vm.confirmLesson && <ConfirmLesson vm={props.vm.confirmLesson} />}
    </div>
  );
});
