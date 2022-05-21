import { FormMode, FormModel } from "../../../forms/FormModel";
import { PupilEntity } from "../../../../models/pupil/PupilEntity";
import { pupilRepository } from "../../../../models/pupil/PupilRepository";
import { StringFieldVM } from "../../../fields/StringField";
import { LinkFieldVM } from "../../../fields/LinkField";
import { IPupil } from "../../../../entities/IPupil";
import { programRepository } from "../../../../models/program/ProgramRepository";
import { ProgramEntity } from "../../../../models/program/ProgramEntity";
import { SubjectEntity } from "../../../../models/subject/SubjectEntity";
import { subjectRepository } from "../../../../models/subject/SubjectRepository";

type PupilFormParameters = {
  mode: FormMode;
  pupilId?: number;
};

export class PupilFormBuilder {
  static async buildForm({ mode, pupilId }: PupilFormParameters) {
    let pupil: PupilEntity | null = null;
    let program: ProgramEntity | null = null;
    let specialSubject: SubjectEntity | null = null;
    if (pupilId !== undefined) {
      pupil = await pupilRepository.getEntityById(pupilId);
      if (pupil === null) {
        throw new Error("Не найден учащийся");
      }
      program = await programRepository.getEntityById(pupil.program);
      specialSubject = await subjectRepository.getEntityById(
        pupil.specialSubject
      );
    }
    const programField = new LinkFieldVM(
      { label: "Программа" },
      {
        entityModel: programRepository,
        initialValues: program === null ? [] : [program],
      }
    );
    return new FormModel<IPupil>({
      title: pupil === null ? "Создание учащегося" : `Учащийся ${pupil.name}`,
      mode,
      fields: {
        name:
          pupil === null
            ? new StringFieldVM({ label: "ФИО" })
            : new StringFieldVM({ label: "ФИО" }, pupil.name),
        program: programField,
        specialSubject: new LinkFieldVM(
          { label: "Специальный предмет" },
          {
            entityModel: subjectRepository,
            initialValues: specialSubject === null ? [] : [specialSubject],
            entitiesFilter: (subject) =>
              subject.isSpecial &&
              subject.specialityGroup === programField.value?.specialityGroup,
          }
        ),
      },
      mapFieldsToProps: (fields) => ({
        name: fields.name.value,
        program: fields.program.getValuesIds()[0],
        specialSubject: fields.specialSubject.getValuesIds()[0],
      }),
      submitHandler:
        mode === "view"
          ? undefined
          : async (data: IPupil) => {
              return pupilId === undefined
                ? pupilRepository.addEntity(data)
                : pupilRepository.updateEntity(pupilId, data);
            },
      deleteHandler:
          pupilId === undefined
              ? undefined
              : async () => {
                return pupilRepository.removeEntity(pupilId);
              },
    });
  }
}
