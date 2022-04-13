import { LinkFieldVM } from "../fields/LinkField";
import { TeacherEntity } from "../../models/teacher/TeacherEntity";
import { ScheduleEntity } from "../../models/schedule/ScheduleEntity";
import { programRepository } from "../../models/program/ProgramRepository";
import { pupilRepository } from "../../models/pupil/PupilRepository";
import { teacherEntityRepository } from "../../models/teacher/TeacherRepository";
import { autorun, makeAutoObservable } from "mobx";
import { loadRepository } from "../../models/load/LoadRepository";
import { subjectRepository } from "../../models/subject/SubjectRepository";

type PlanItem = {
  subjectName: string;
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
  const options = [];
  for (let i = 0; i < MAX_YEAR; i++) {
    options.push({
      value: i,
      text: String(i + 1),
    });
  }
  return options;
})();

export class LoadsDistributionVM {
  get selectedYear(): number {
    return this._selectedYear;
  }

  set selectedYear(value: number) {
    this._selectedYear = value;
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
    return this.pupilItems.filter((item) => item.year === this._selectedYear);
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

  private _itemsOnPage = ITEMS_ON_PAGE_VALUES[0];
  private _currentPage = 0;

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

  private _calculateItems() {
    // get schedule's pupils (with years)
    const allPupils = pupilRepository.entities;
    const allPrograms = programRepository.entities;
    const allTeachers = teacherEntityRepository.entities;
    const allSubjects = subjectRepository.entities;
    if (!programRepository.isSynchronized) {
      return;
    }
    const pupilsIds = Object.keys(this._schedule.pupilsYears).map((key) =>
      Number(key)
    );
    this._items = pupilsIds.map((pupilId) => {
      const currentPupil = allPupils[pupilId];
      const program = allPrograms[currentPupil.program];
      const plans = program.yearPlans;
      const pupilYear = this._schedule.pupilsYears[pupilId];
      const thisYearPlan = plans[pupilYear];
      const specialityLoad = this._schedule.loads.find(
        ({ pupil, subject }) =>
          pupil === pupilId && subject === currentPupil.specialSubject
      );
      return {
        name: currentPupil.name,
        year: pupilYear,
        planItems: [
          {
            subjectName: allSubjects[currentPupil.specialSubject].name,
            halfHours: thisYearPlan.specialityHalfHours,
            teacherField: new LinkFieldVM<TeacherEntity>(
              { label: "Преподаватель" },
              {
                entityModel: teacherEntityRepository,
                entitiesFilter: (teacher) =>
                  teacher.subjects.includes(currentPupil.specialSubject),
                initialValues:
                  specialityLoad === undefined
                    ? []
                    : [allTeachers[specialityLoad.teacher]],
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
                subjectName: allSubjects[Number(subjectId)].name,
                halfHours,
                teacherField: new LinkFieldVM<TeacherEntity>(
                  { label: "Преподаватель" },
                  {
                    entityModel: teacherEntityRepository,
                    entitiesFilter: (teacher) =>
                      teacher.subjects.includes(Number(subjectId)),
                    initialValues:
                      subjectLoad === undefined
                        ? []
                        : [allTeachers[subjectLoad.teacher]],
                    hasEmptyValueOption: true,
                    valueChangedCallback: (teacherValue) => {
                      this._onTeacherUpdate({
                        pupilId,
                        teacherId:
                          teacherValue.length === 0 ? null : teacherValue[0].id,
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
    });
  }

  constructor(schedule: ScheduleEntity) {
    this._schedule = schedule;
    makeAutoObservable(this);
    autorun(() => this._calculateItems());
  }
}
