import { UserFormVM } from "../../../view-models/forms/UserFormVM";
import { LinkField } from "../../fields/link-field/LinkField";
import { Form } from "../../Form";
import { Select } from "../../select/Select";
import { observer } from "mobx-react-lite";

type Props = {
  vm: UserFormVM;
  onSubmit?: (newId: number) => void;
  onCancel?: () => void;
};

export const UserForm = observer(({ vm, onSubmit, onCancel }: Props) => {
  return (
    <Form form={vm} onSubmit={onSubmit} onCancel={onCancel}>
      <Select
        multiple
        label={"Роли"}
        values={vm.selectedRoles}
        onChange={(values) => {
          vm.selectedRoles = values;
        }}
        options={vm.rolesOptions}
      />
      {vm.isTeacherFieldVisible && vm.teacherField !== null && (
        <LinkField field={vm.teacherField} />
      )}
    </Form>
  );
});
