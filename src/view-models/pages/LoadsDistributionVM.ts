import { LinkFieldVM } from "../fields/LinkField";
import { TeacherEntity } from "../../models/teacher/TeacherEntity";
import { ScheduleEntity } from "../../models/schedule/ScheduleEntity";
import { programRepository } from "../../models/program/ProgramRepository";
import { pupilRepository } from "../../models/pupil/PupilRepository";
import { teacherRepository } from "../../models/teacher/TeacherRepository";
import { autorun, makeAutoObservable } from "mobx";
import { loadRepository } from "../../models/load/LoadRepository";
import { subjectRepository } from "../../models/subject/SubjectRepository";
import { scheduleContextStore } from "../../models/schedule-context-store/ScheduleContextStore";
import {ProgramEntity} from "../../models/program/ProgramEntity";

type PlanItem = {
  subjectName: string;
  isSpecial: boolean;
  halfHours: number;
  teacherField: LinkFieldVM<TeacherEntity>;
};

type PupilItem = {
  name: string;
  year: number;
  planItems: PlanItem[];
};

type LoadUpdateParameters = {
  pupilId: number;
  teacherId: number | null;
  subjectId: number;
};

const ITEMS_ON_PAGE_VALUES = [5, 10, 25];

const MAX_YEAR = 8;

const YEAR_OPTIONS = (() => {
  const options = [
    {
      value: 0,
      text: "Все",
    },
  ];
  for (let i = 1; i <= MAX_YEAR; i++) {
    options.push({
      value: i,
      text: String(i),
    });
  }
  return options;
})();

export class LoadsDistributionVM {
  get programOptions(): { text: string; value: number }[] {
    return this._programOptions;
  }
  get selectedProgram(): number {
    return this._selectedProgram;
  }

  set selectedProgram(value: number) {
    this._selectedProgram = value;
  }
  get isLoading(): boolean {
    return this._isLoading;
  }
  get selectedYear(): number {
    return this._selectedYear;
  }

  set selectedYear(value: number) {
    this._selectedYear = value;
    this._currentPage = 0;
  }

  get yearOptions() {
    return YEAR_OPTIONS;
  }

  get pupilItemsOnPage(): PupilItem[] {
    const firstItemIndex = this._currentPage * this._itemsOnPage;
    return this.filteredPupilItems.slice(
      firstItemIndex,
      firstItemIndex + this._itemsOnPage
    );
  }

  get filteredPupilItems(): PupilItem[] {
    return this._selectedYear === 0
      ? this.pupilItems
      : this.pupilItems.filter((item) => item.year === this._selectedYear);
  }

  get pupilItems(): PupilItem[] {
    return this._items;
  }

  get pageCount() {
    return Math.ceil(this.filteredPupilItems.length / this._itemsOnPage);
  }

  set currentPage(value: number) {
    this._currentPage = value;
  }

  get currentPageNumber() {
    return this._currentPage;
  }

  private _schedule: ScheduleEntity;
  private _items: PupilItem[] = [];

  private _selectedYear: number = 0;

  private _programOptions = [
    {
      value: 0,
      text: "Все",
    }
  ]
  private _selectedProgram: number = 0;

  private _itemsOnPage = ITEMS_ON_PAGE_VALUES[0];
  private _currentPage = 0;
  private _isLoading = false;

  private _onTeacherUpdate({
    pupilId,
    teacherId,
    subjectId,
  }: LoadUpdateParameters) {
    const load = this._schedule.loads.find(
      ({ pupil, subject }) => pupil === pupilId && subject === subjectId
    );
    if (teacherId === null) {
      if (load !== undefined) {
        //удаление нагрузки
        loadRepository.removeEntity(load.id);
      }
      return;
    }
    if (load === undefined) {
      loadRepository.addEntity({
        schedule: this._schedule.id,
        pupil: pupilId,
        subject: subjectId,
        teacher: teacherId,
      });
    } else {
      loadRepository.updateEntity(load.id, {
        teacher: teacherId,
      });
    }
  }

  private async _calculateItems() {
    this._isLoading = true;
    const pupilsIds = Object.keys(this._schedule.pupilsYears).map((key) =>
      Number(key)
    );
    this._items = pupilsIds
      .map((pupilId) => {
        const currentPupil = pupilRepository.entities[pupilId];
        const program = programRepository.entities[currentPupil.program];
        const plans = program.yearPlans;
        const pupilYear = this._schedule.pupilsYears[pupilId];
        const thisYearPlan = plans[pupilYear - 1];
        const specialityLoad = this._schedule.loads.find(
          ({ pupil, subject }) =>
            pupil === pupilId && subject === currentPupil.specialSubject
        );
        return {
          name: currentPupil.name,
          year: pupilYear,
          planItems: [
            {
              subjectName:
                subjectRepository.entities[currentPupil.specialSubject].name,
              isSpecial: true,
              halfHours: thisYearPlan.specialityHalfHours,
              teacherField: new LinkFieldVM<TeacherEntity>(
                { label: "Преподаватель" },
                {
                  entityModel: teacherRepository,
                  entitiesFilter: (teacher) =>
                    teacher.subjects.includes(currentPupil.specialSubject),
                  initialValues:
                    specialityLoad === undefined
                      ? []
                      : [teacherRepository.entities[specialityLoad.teacher]],
                  hasEmptyValueOption: true,
                  valueChangedCallback: (teacherValue) => {
                    this._onTeacherUpdate({
                      pupilId,
                      teacherId:
                        teacherValue.length === 0 ? null : teacherValue[0].id,
                      subjectId: currentPupil.specialSubject,
                    });
                  },
                }
              ),
            },
            ...Object.entries(thisYearPlan.commonSubjectsHalfHours).map(
              ([subjectId, halfHours]) => {
                const subjectLoad = this._schedule.loads.find(
                  ({ pupil, subject }) =>
                    pupil === pupilId && subject === Number(subjectId)
                );
                return {
                  subjectName:
                    subjectRepository.entities[Number(subjectId)].name,
                  isSpecial: false,
                  halfHours,
                  teacherField: new LinkFieldVM<TeacherEntity>(
                    { label: "Преподаватель" },
                    {
                      entityModel: teacherRepository,
                      entitiesFilter: (teacher) =>
                        teacher.subjects.includes(Number(subjectId)),
                      initialValues:
                        subjectLoad === undefined
                          ? []
                          : [teacherRepository.entities[subjectLoad.teacher]],
                      hasEmptyValueOption: true,
                      valueChangedCallback: (teacherValue) => {
                        this._onTeacherUpdate({
                          pupilId,
                          teacherId:
                            teacherValue.length === 0
                              ? null
                              : teacherValue[0].id,
                          subjectId: Number(subjectId),
                        });
                      },
                    }
                  ),
                };
              }
            ),
          ],
        };
      })
      .sort((a, b) => a.year - b.year); // todo destroy the pyramid
    this._isLoading = false;
  }

  private async _init() {
    this._isLoading = true;
    await Promise.all([
      pupilRepository.getAllEntities(),
      programRepository.getAllEntities(),
      teacherRepository.getAllEntities(),
      subjectRepository.getAllEntities(),
    ]);
    this._isLoading = false;
    autorun(() => this._calculateItems());
  }

  constructor() {
    if (scheduleContextStore.currentSchedule === null) {
      throw new Error("Не найдено текущее расписание");
    }
    this._schedule = scheduleContextStore.currentSchedule;
    autorun(() => {
      if (scheduleContextStore.currentSchedule === null) {
        throw new Error("Не найдено текущее расписание");
      }
      this._schedule = scheduleContextStore.currentSchedule;
    });
    makeAutoObservable(this);
    void this._init();
  }
}
