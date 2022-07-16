import { FormMode, FormModel } from "../../../forms/FormModel";
import { StringFieldVM } from "../../../fields/StringField";
import { ScheduleEntity } from "../../../../models/schedule/ScheduleEntity";
import { scheduleRepository } from "../../../../models/schedule/ScheduleRepository";
import { ScheduleFormVM } from "../../../forms/ScheduleFormVM";
import { ISchedule } from "../../../../entities/ISchedule";

type ScheduleFormParameters = {
  mode: FormMode;
  scheduleId?: number;
};

export class ScheduleFormBuilder {
  static async buildForm({ mode, scheduleId }: ScheduleFormParameters) {
    let schedule: ScheduleEntity | null = null;
    if (scheduleId !== undefined) {
      schedule = await scheduleRepository.getEntityById(scheduleId);
      if (schedule === null) {
        throw new Error("Не найдено расписание");
      }
    }
    const basicForm = new FormModel<{ name: string }>({
      title:
        schedule === null
          ? "Создание расписания"
          : `Расписание "${schedule.name}"`,
      mode,
      fields: {
        name:
          schedule === null
            ? new StringFieldVM({ label: "Название" })
            : new StringFieldVM({ label: "Название" }, schedule.name),
      },
      mapFieldsToProps: (fields) => ({
        name: fields.name.value,
      }),
      deleteHandler:
          scheduleId === undefined
              ? undefined
              : async () => {
                return scheduleRepository.removeEntity(scheduleId);
              },
    });
    return new ScheduleFormVM({
      basicForm,
      schedule: schedule === null ? undefined : schedule,
      submitHandler:
        mode === "view"
          ? undefined
          : async (data: ISchedule) => {
              return scheduleId === undefined
                ? scheduleRepository.addEntity(data)
                : scheduleRepository.updateEntity(scheduleId, data);
            },
    });
  }
}
