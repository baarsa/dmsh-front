import { FormModel, IFormModel } from "./FormModel";
import { YearPlansControlVM } from "./YearPlansControlVM";
import { IProgram } from "../../entities/IProgram";

type Parameters = {
  basicForm: FormModel<{ name: string; specialityGroup: number }>;
  yearPlansControl: YearPlansControlVM;
  submitHandler?: (data: IProgram) => Promise<number>;
  cancelHandler?: () => void;
};

export class ProgramFormModel implements IFormModel {
  get mode() {
    return this._basicForm.mode;
  }

  get title() {
    return this._basicForm.title;
  }

  get yearPlans() {
    return this._yearPlans;
  }

  getFields() {
    return this._basicForm.getFields();
  }

  isValid() {
    return this._basicForm.isValid() && this._yearPlans.isValid;
  }

  async handleSubmit() {
    const basicFields = this._basicForm.mappedFields;
    if (this._submitHandler === undefined) {
      throw new Error("Обработчик формы не определен");
    }
    return this._submitHandler({
      ...basicFields,
      yearPlans: this._yearPlans.value,
    });
  }

  handleCancel() {
    if (this._cancelHandler !== undefined) {
      this._cancelHandler();
    }
  }

  private _basicForm: FormModel<{ name: string; specialityGroup: number }>;
  private readonly _yearPlans: YearPlansControlVM;
  private readonly _submitHandler?: (data: IProgram) => Promise<number>;
  private readonly _cancelHandler?: () => void;

  constructor({
    basicForm,
    yearPlansControl,
    submitHandler,
    cancelHandler,
  }: Parameters) {
    this._basicForm = basicForm;
    this._yearPlans = yearPlansControl;
    this._submitHandler = submitHandler;
    this._cancelHandler = cancelHandler;
  }
}
