import { IProgram } from "../../entities/IProgram";
import { LinkFieldVM } from "../fields/LinkField";
import { subjectRepository } from "../../models/subject/SubjectRepository";
import { SubjectEntity } from "../../models/subject/SubjectEntity";
import { makeAutoObservable, makeObservable, observable } from "mobx";
import { IFormModel } from "./FormModel";

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
    const thisYearPlanSubjects: Array<{
      subject: number;
      subjectName: string;
      halfHours: number;
    }> = observable(
      yearPlan === undefined
        ? []
        : Object.entries(yearPlan.commonSubjectsHalfHours).map(
            ([subject, halfHours]) => ({
              subject: Number(subject),
              subjectName: this._subjects[Number(subject)].name,
              halfHours,
            })
          )
    );
    this._yearPlans.push({
      specialityHalfHours:
        yearPlan === undefined ? 0 : yearPlan.specialityHalfHours,
      subjectField: new LinkFieldVM(
        {
          label: "Предмет",
        },
        {
          entityModel: subjectRepository,
          entitiesFilter: (currentSubject) =>
            !currentSubject.isSpecial &&
            thisYearPlanSubjects.every(
              ({ subject }) => subject !== currentSubject.id
            ),
        }
      ),
      newSubjectHalfHours: 0,
      commonSubjects: thisYearPlanSubjects,
    });
  }

  removeYearPlan(index: number) {
    this._yearPlans = [
      ...this._yearPlans.slice(0, index),
      ...this._yearPlans.slice(index + 1),
    ];
  }

  addCommonSubject(yearPlanIndex: number) {
    const yearPlan = this._yearPlans[yearPlanIndex];
    const subjectId = yearPlan.subjectField.getValuesIds()[0];
    yearPlan.commonSubjects.push({
      subject: subjectId,
      subjectName: this._subjects[subjectId].name,
      halfHours: yearPlan.newSubjectHalfHours,
    });
    yearPlan.subjectField.setValues([]);
    yearPlan.newSubjectHalfHours = 0;
  }

  removeCommonSubject(yearPlanIndex: number, commonSubjectIndex: number) {
    const yearPlan = this._yearPlans[yearPlanIndex];
    yearPlan.commonSubjects.splice(commonSubjectIndex, 1);
    // maybe add confirm modal
  }

  setSpecialityHalfHours(yearPlanIndex: number, value: number) {
    this._yearPlans[yearPlanIndex].specialityHalfHours = value;
  }

  setNewSubjectHalfHours(yearPlanIndex: number, value: number) {
    this._yearPlans[yearPlanIndex].newSubjectHalfHours = value;
  }

  private _yearPlans: Array<{
    specialityHalfHours: number;
    subjectField: LinkFieldVM<SubjectEntity>;
    newSubjectHalfHours: number;
    commonSubjects: Array<{
      subject: number;
      subjectName: string;
      halfHours: number;
    }>;
  }> = [];

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
