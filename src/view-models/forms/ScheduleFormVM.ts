import { FormModel, IFormModel } from "./FormModel";
import { ISchedule } from "../../entities/ISchedule";
import { PupilEntity } from "../../models/pupil/PupilEntity";
import { LinkFieldVM } from "../fields/LinkField";
import { pupilRepository } from "../../models/pupil/PupilRepository";
import { ScheduleEntity } from "../../models/schedule/ScheduleEntity";
import { makeAutoObservable } from "mobx";
import { ProgramEntity } from "../../models/program/ProgramEntity";
import { programRepository } from "../../models/program/ProgramRepository";

type Parameters = {
  basicForm: FormModel<{ name: string }>;
  schedule?: ScheduleEntity;
  submitHandler?: (data: ISchedule) => Promise<number>;
  cancelHandler?: () => void;
};

export class ScheduleFormVM implements IFormModel {
  get currentYear(): number {
    return this._currentYear + 1;
  }

  set currentYear(value: number) {
    this._currentYear = value - 1;
  }

  get isYearSelectDisabled() {
    return this.pupilField.value === null;
  }

  get maxYear() {
    if (this.pupilField.value === null) {
      return 0;
    }
    return this._programs[this.pupilField.value.program].yearPlans.length;
  }

  get pupilField(): LinkFieldVM<PupilEntity> {
    return this._pupilField;
  }
  get mode() {
    return this._basicForm.mode;
  }

  get title() {
    return this._basicForm.title;
  }

  getFields() {
    return this._basicForm.getFields();
  }

  isValid() {
    return this._basicForm.isValid() && this._pupilsYears.length > 0;
  }

  get pupilsYears() {
    return this._pupilsYears.map(({ pupil, year }) => ({
      id: pupil.id,
      name: pupil.name,
      year: year + 1,
    }));
  }

  get canAddPupil() {
    return this._pupilField.value !== null;
  }

  addPupil() {
    if (this._pupilField.value === null) {
      throw new Error("Не выбран учащийся");
    }
    this._pupilsYears.push({
      pupil: this._pupilField.value,
      year: this._currentYear,
    });
    this._pupilField.setValues([]);
    this._currentYear = 0;
  }

  removePupil(pupilId: number) {
    // todo блокировать (информировать), если у ученика уже есть нагрузка/уроки
    const index = this._pupilsYears.findIndex(
      ({ pupil }) => pupil.id === pupilId
    );
    this._pupilsYears.splice(index, 1);
  }

  async handleSubmit() {
    const basicFields = this._basicForm.mappedFields;
    if (this._submitHandler === undefined) {
      throw new Error("Обработчик формы не определен");
    }
    return this._submitHandler({
      ...basicFields,
      pupilsYears: this._pupilsYears.reduce((acc, item) => {
        return {
          ...acc,
          [item.pupil.id]: item.year,
        };
      }, {}),
    });
  }

  handleCancel() {
    if (this._cancelHandler !== undefined) {
      this._cancelHandler();
    }
  }

  private _basicForm: FormModel<{ name: string }>;
  private readonly _submitHandler?: (data: ISchedule) => Promise<number>;
  private readonly _cancelHandler?: () => void;
  private _pupilsYears: Array<{ pupil: PupilEntity; year: number }> = [];
  private _pupilField: LinkFieldVM<PupilEntity> = new LinkFieldVM<PupilEntity>(
    {
      label: "Учащийся",
    },
    {
      entityModel: pupilRepository,
      entitiesFilter: (pupil) =>
        this._pupilsYears.every((item) => item.pupil !== pupil),
    }
  );
  private _currentYear: number = 0;
  private _programs: Record<number, ProgramEntity> = {};
  private _isLoading: boolean = true;

  private async _init(schedule?: ScheduleEntity) {
    this._programs = await programRepository.getAllEntities();
    if (schedule !== undefined) {
      const pupils = await pupilRepository.getAllEntities();
      this._pupilsYears = Object.entries(schedule.pupilsYears).map(
        ([pupilId, year]) => ({
          pupil: pupils[Number(pupilId)],
          year,
        })
      );
    }
    this._isLoading = false; // todo use in view
  }

  constructor({
    basicForm,
    schedule,
    submitHandler,
    cancelHandler,
  }: Parameters) {
    this._basicForm = basicForm;
    this._submitHandler = submitHandler;
    this._cancelHandler = cancelHandler;
    void this._init(schedule);

    makeAutoObservable(this);
  }
}
