import { FormMode, FormModel } from "../../../view-models/forms/FormModel";
import { subjectRepository } from "../../../models/subject/SubjectRepository";
import { specialityGroupRepository } from "../../../models/speciality-group/SpecialityGroupRepository";
import { BooleanFieldVM } from "../../../view-models/fields/BooleanField";
import { ISubject } from "../../../entities/ISubject";
import { StringFieldVM } from "../../../view-models/fields/StringField";
import { LinkFieldVM } from "../../../view-models/fields/LinkField";
import { SubjectEntity } from "../../../models/subject/SubjectEntity";
import { SpecialityGroupEntity } from "../../../models/speciality-group/SpecialityGroupEntity";

type SubjectFormParameters = {
  mode: FormMode;
  subjectId?: number;
};

export class SubjectFormBuilder {
  static async buildForm({ mode, subjectId }: SubjectFormParameters) {
    let subject: SubjectEntity | null = null;
    let specialityGroup: SpecialityGroupEntity | null = null;
    if (subjectId !== undefined) {
      subject = await subjectRepository.getEntityById(subjectId);
      if (subject === null) {
        throw new Error("Не найден предмет");
      }
      specialityGroup =
        subject.specialityGroup === null
          ? null
          : await specialityGroupRepository.getEntityById(
              subject?.specialityGroup
            );
    }
    const isSpecialField =
      subject === null
        ? new BooleanFieldVM({ label: "Специальный" })
        : new BooleanFieldVM({ label: "Специальный" }, subject.isSpecial);
    return new FormModel<ISubject>({
      title: subject === null ? "Создание предмета" : `Предмет ${subject.name}`,
      mode,
      fields: {
        name:
          subject === null
            ? new StringFieldVM({ label: "Название" })
            : new StringFieldVM({ label: "Название" }, subject.name),
        isSpecial: isSpecialField,
        specialityGroup: new LinkFieldVM(
          { label: "Группа специальностей", controllingField: isSpecialField },
          {
            entityModel: specialityGroupRepository,
            initialValue: specialityGroup ?? undefined,
          }
        ),
      },
      mapFieldsToProps: (fields) => ({
        name: fields.name.value,
        isSpecial: fields.isSpecial.value,
        specialityGroup: fields.specialityGroup.getValueId(),
      }),
      submitHandler:
        mode === "view"
          ? undefined
          : async (data: ISubject) => {
              return subjectId === undefined
                ? subjectRepository.addEntity(data)
                : subjectRepository.updateEntity(subjectId, data);
            },
    });
  }
}
