import { LinkFieldVM } from "../fields/LinkField";
import { TeacherEntity } from "../../models/teacher/TeacherEntity";
import { ScheduleEntity } from "../../models/schedule/ScheduleEntity";
import { programRepository } from "../../models/program/ProgramRepository";
import { pupilEntityRepository } from "../../models/pupil/PupilRepository";
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

export class LoadsDistributionVM {
  get filteredPupilItems(): PupilItem[] {
    return this.pupilItems.filter((item) => item.year === this._selectedYear);
  }

  get pupilItems(): PupilItem[] {
    return this._items;
  }

  private _schedule: ScheduleEntity;
  private _items: PupilItem[] = [];

  private _selectedYear: number = 0;

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
    const allPupils = pupilEntityRepository.entities;
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
                initialValue:
                  specialityLoad === undefined
                    ? undefined
                    : allTeachers[specialityLoad.teacher],
                hasEmptyValueOption: true,
                valueChangedCallback: (teacherValue) => {
                  this._onTeacherUpdate({
                    pupilId,
                    teacherId: teacherValue === null ? null : teacherValue.id,
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
                    initialValue:
                      subjectLoad === undefined
                        ? undefined
                        : allTeachers[subjectLoad.teacher],
                    hasEmptyValueOption: true,
                    valueChangedCallback: (teacherValue) => {
                      this._onTeacherUpdate({
                        pupilId,
                        teacherId:
                          teacherValue === null ? null : teacherValue.id,
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
