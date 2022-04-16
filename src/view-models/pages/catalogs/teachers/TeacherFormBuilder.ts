import { FormMode, FormModel } from "../../../forms/FormModel";
import { SubjectEntity } from "../../../../models/subject/SubjectEntity";
import { subjectRepository } from "../../../../models/subject/SubjectRepository";
import { BooleanFieldVM } from "../../../fields/BooleanField";
import { StringFieldVM } from "../../../fields/StringField";
import { LinkFieldVM } from "../../../fields/LinkField";
import { TeacherEntity } from "../../../../models/teacher/TeacherEntity";
import { teacherRepository } from "../../../../models/teacher/TeacherRepository";
import { ITeacher } from "../../../../entities/ITeacher";

type TeacherFormParameters = {
  mode: FormMode;
  teacherId?: number;
};

export class TeacherFormBuilder {
  static async buildForm({ mode, teacherId }: TeacherFormParameters) {
    let teacher: TeacherEntity | null = null;
    let subjects: SubjectEntity[] = [];
    if (teacherId !== undefined) {
      teacher = await teacherRepository.getEntityById(teacherId);
      if (teacher === null) {
        throw new Error("Не найден преподаватель");
      }
      const allSubjects = await subjectRepository.getAllEntities();
      subjects = teacher.subjects.map((id) => allSubjects[id]); // work?
    }
    return new FormModel<ITeacher>({
      title:
        teacher === null
          ? "Создание преподавателя"
          : `Преподаватель ${teacher.name}`,
      mode,
      fields: {
        name:
          teacher === null
            ? new StringFieldVM({ label: "ФИО" })
            : new StringFieldVM({ label: "ФИО" }, teacher.name),
        canAssist:
          teacher === null
            ? new BooleanFieldVM({ label: "Иллюстратор/концертмейстер" })
            : new BooleanFieldVM(
                { label: "Иллюстратор/концертмейстер" },
                teacher.canAssist
              ),
        subjects: new LinkFieldVM(
          { label: "Предметы" },
          {
            entityModel: subjectRepository,
            isMultiple: true,
            initialValues: subjects.length === 0 ? undefined : subjects,
          }
        ),
      },
      mapFieldsToProps: (fields) => ({
        name: fields.name.value,
        canAssist: fields.canAssist.value,
        subjects: fields.subjects.getValuesIds(),
      }),
      submitHandler:
        mode === "view"
          ? undefined
          : async (data: ITeacher) => {
              return teacherId === undefined
                ? teacherRepository.addEntity(data)
                : teacherRepository.updateEntity(teacherId, data);
            },
    });
  }
}
