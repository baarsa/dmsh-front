import { FormMode, FormModel } from "../../../forms/FormModel";
import { SpecialityGroupEntity } from "../../../../models/speciality-group/SpecialityGroupEntity";
import { specialityGroupRepository } from "../../../../models/speciality-group/SpecialityGroupRepository";
import { StringFieldVM } from "../../../fields/StringField";
import { LinkFieldVM } from "../../../fields/LinkField";
import { ProgramEntity } from "../../../../models/program/ProgramEntity";
import { programRepository } from "../../../../models/program/ProgramRepository";
import { ProgramFormModel } from "../../../forms/ProgramFormModel";
import { YearPlansControlVM } from "../../../forms/YearPlansControlVM";
import { IProgram } from "../../../../entities/IProgram";

type ProgramFormParameters = {
  mode: FormMode;
  programId?: number;
};

export class ProgramFormBuilder {
  static async buildForm({ mode, programId }: ProgramFormParameters) {
    let program: ProgramEntity | null = null;
    let specialityGroup: SpecialityGroupEntity | null = null;
    if (programId !== undefined) {
      program = await programRepository.getEntityById(programId);
      if (program === null) {
        throw new Error("Не найдена программа");
      }
      specialityGroup =
        program.specialityGroup === null
          ? null
          : await specialityGroupRepository.getEntityById(
              program.specialityGroup
            );
    }
    const basicForm = new FormModel<{ name: string; specialityGroup: number }>({
      title:
        program === null ? "Создание программы" : `Программа "${program.name}"`,
      mode,
      fields: {
        name:
          program === null
            ? new StringFieldVM({ label: "Название" })
            : new StringFieldVM({ label: "Название" }, program.name),
        specialityGroup: new LinkFieldVM(
          { label: "Группа специальностей" },
          {
            entityModel: specialityGroupRepository,
            initialValues:
              specialityGroup === null ? undefined : [specialityGroup],
          }
        ),
      },
      mapFieldsToProps: (fields) => ({
        name: fields.name.value,
        specialityGroup: fields.specialityGroup.getValuesIds()[0],
      }),
      deleteHandler:
          programId === undefined
              ? undefined
              : async () => {
                return programRepository.removeEntity(programId);
              },
    });
    return new ProgramFormModel({
      basicForm,
      yearPlansControl: new YearPlansControlVM(
        basicForm,
        program?.yearPlans ?? []
      ),
      submitHandler:
        mode === "view"
          ? undefined
          : async (data: IProgram) => {
              return programId === undefined
                ? programRepository.addEntity(data)
                : programRepository.updateEntity(programId, data);
            },
    });
  }
}
