import { subjectRepository } from "../../models/subject/SubjectRepository";
import { BooleanFieldVM } from "../fields/BooleanField";
import { LinkFieldVM } from "../fields/LinkField";
import { StringFieldVM } from "../fields/StringField";
import { FormModel, IFormModel } from "../forms/FormModel";

type Subject = {
  name: string;
  isSpecial: boolean;
  specialityGroup: number | null;
};

export class CreateSubjectViewModel {
  form: IFormModel;
  constructor() {
    const isSpecialField = new BooleanFieldVM({ label: "is special" });
    this.form = new FormModel<Subject>({
      title: "create subject form",
      mode: "edit",
      fields: {
        name: new StringFieldVM({ label: "name" }),
        isSpecial: isSpecialField,
        specialityGroup: new LinkFieldVM(
          { label: "speciality group", controllingField: isSpecialField },
          subjectRepository
        )
      },
      mapFieldsToProps: (fields) => ({
        name: fields.name.value,
        isSpecial: fields.isSpecial.value,
        specialityGroup: fields.specialityGroup.getValueId()
      }),
      submitHandler: (data: Subject) => {
        subjectRepository.addEntity(data); // return id and
        // go to view: /subjects/view/{id}
      },
      cancelHandler: () => {
        // go to /subjects
      }
    });
  }
}
