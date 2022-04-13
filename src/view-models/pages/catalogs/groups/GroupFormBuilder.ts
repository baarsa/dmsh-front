import { FormMode, FormModel } from "../../../forms/FormModel";
import { StringFieldVM } from "../../../fields/StringField";
import { LinkFieldVM } from "../../../fields/LinkField";
import { GroupEntity } from "../../../../models/group/GroupEntity";
import { groupRepository } from "../../../../models/group/GroupRepository";
import { IGroup } from "../../../../entities/IGroup";
import { pupilEntityRepository } from "../../../../models/pupil/PupilRepository";
import { PupilEntity } from "../../../../models/pupil/PupilEntity";

type GroupFormParameters = {
  mode: FormMode;
  groupId?: number;
};

export class GroupFormBuilder {
  static async buildForm({ mode, groupId }: GroupFormParameters) {
    let group: GroupEntity | null = null;
    let pupils: PupilEntity[] = [];
    if (groupId !== undefined) {
      group = await groupRepository.getEntityById(groupId);
      const allPupils = await pupilEntityRepository.getAllEntities();
      if (group === null) {
        throw new Error("Не найдена группа");
      }
      pupils = group.pupils.map((id) => allPupils[id]);
    }
    return new FormModel<IGroup>({
      title: group === null ? "Создание группы" : `Группа "${group.name}"`,
      mode,
      fields: {
        name:
          group === null
            ? new StringFieldVM({ label: "Название" })
            : new StringFieldVM({ label: "Название" }, group.name),
        pupils: new LinkFieldVM(
          { label: "Учащиеся" },
          {
            entityModel: pupilEntityRepository,
            isMultiple: true,
            showValuesList: true,
            initialValues: pupils,
          }
        ),
      },
      mapFieldsToProps: (fields) => ({
        name: fields.name.value,
        pupils: fields.pupils.getValuesIds(),
      }),
      submitHandler:
        mode === "view"
          ? undefined
          : async (data: IGroup) => {
              return groupId === undefined
                ? groupRepository.addEntity(data)
                : groupRepository.updateEntity(groupId, data);
            },
    });
  }
}
