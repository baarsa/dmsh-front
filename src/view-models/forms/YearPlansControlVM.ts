import { IProgram } from "../../entities/IProgram";
import { LinkFieldVM } from "../fields/LinkField";
import { subjectRepository } from "../../models/subject/SubjectRepository";
import { SubjectEntity } from "../../models/subject/SubjectEntity";
import { makeAutoObservable } from "mobx";
import { IFormModel } from "./FormModel";

class YearPlanItemVM {
  get subjectField(): LinkFieldVM<SubjectEntity> {
    return this._subjectField;
  }

  get commonSubjects(): Array<{
    subject: number;
    subjectName: string;
    halfHours: number;
  }> {
    return this._commonSubjects;
  }
  get canAddSubject() {
    return this._subjectField.isValid() && this._newSubjectHalfHours > 0;
  }
  get specialityHalfHours(): number {
    return this._specialityHalfHours;
  }

  set specialityHalfHours(value: number) {
    this._specialityHalfHours = value;
  }

  get newSubjectHalfHours(): number {
    return this._newSubjectHalfHours;
  }

  set newSubjectHalfHours(value: number) {
    this._newSubjectHalfHours = value;
  }

  addCommonSubject() {
    const subjectId = this._subjectField.getValuesIds()[0];
    this._commonSubjects.push({
      subject: subjectId,
      subjectName: this._subjects[subjectId].name,
      halfHours: this.newSubjectHalfHours,
    });
    this._subjectField.setValues([]);
    this.newSubjectHalfHours = 0;
  }

  removeCommonSubject(commonSubjectIndex: number) {
    this._commonSubjects.splice(commonSubjectIndex, 1);
    // maybe add confirm modal
  }

  private _specialityHalfHours: number;
  private readonly _subjectField: LinkFieldVM<SubjectEntity>;
  private _newSubjectHalfHours: number;
  private readonly _commonSubjects: Array<{
    subject: number;
    subjectName: string;
    halfHours: number;
  }>;
  private _subjects: Record<number, SubjectEntity>;

  constructor(
    subjects: Record<number, SubjectEntity>,
    yearPlan?: IProgram["yearPlans"][number]
  ) {
    this._subjects = subjects;
    this._specialityHalfHours =
      yearPlan === undefined ? 0 : yearPlan.specialityHalfHours;
    this._subjectField = new LinkFieldVM(
      {
        label: "Предмет",
      },
      {
        entityModel: subjectRepository,
        entitiesFilter: (currentSubject) =>
          !currentSubject.isSpecial &&
          this._commonSubjects.every(
            ({ subject }) => subject !== currentSubject.id
          ),
      }
    );
    this._newSubjectHalfHours = 0;
    this._commonSubjects =
      yearPlan === undefined
        ? []
        : Object.entries(yearPlan.commonSubjectsHalfHours).map(
            ([subject, halfHours]) => ({
              subject: Number(subject),
              subjectName: this._subjects[Number(subject)].name,
              halfHours,
            })
          );
    makeAutoObservable(this);
  }
}

export class YearPlansControlVM {
  get yearPlans() {
    return this._yearPlans;
  }
  get isValid() {
    return (
      this._yearPlans.length > 0 &&
      this._yearPlans.every((yearPlan) => yearPlan.specialityHalfHours > 0)
    );
  }
  get mode() {
    return this._parentForm.mode;
  }
  get value(): IProgram["yearPlans"] {
    return this._yearPlans.map((yearPlan) => ({
      specialityHalfHours: yearPlan.specialityHalfHours,
      commonSubjectsHalfHours: yearPlan.commonSubjects.reduce((acc, item) => {
        return {
          ...acc,
          [item.subject]: item.halfHours,
        };
      }, {}),
    }));
  }

  addYearPlan(yearPlan?: IProgram["yearPlans"][number]) {
    this._yearPlans.push(new YearPlanItemVM(this._subjects, yearPlan));
  }

  removeYearPlan(index: number) {
    this._yearPlans = [
      ...this._yearPlans.slice(0, index),
      ...this._yearPlans.slice(index + 1),
    ];
  }

  private _yearPlans: Array<YearPlanItemVM> = [];

  private _parentForm: IFormModel;
  private _subjects: Record<number, SubjectEntity> = {};
  private _isLoading: boolean = true;

  private async _init(yearPlans: IProgram["yearPlans"]) {
    this._subjects = await subjectRepository.getAllEntities();
    yearPlans.forEach((yearPlan) => {
      this.addYearPlan(yearPlan);
    });
    this._isLoading = false;
  }

  constructor(parentForm: IFormModel, yearPlans: IProgram["yearPlans"]) {
    this._parentForm = parentForm;
    void this._init(yearPlans);
    makeAutoObservable(this);
  }
}
