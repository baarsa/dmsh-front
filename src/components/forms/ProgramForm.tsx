import { Form } from "./form/Form";
import { ProgramFormModel } from "../../view-models/forms/ProgramFormModel";
import { YearPlansControl } from "./year-plans-control/YearPlansControl";

type Props = {
  vm: ProgramFormModel;
  onSubmit?: (newId: number) => void;
  onCancel?: () => void;
};

export const ProgramForm = ({ vm, onSubmit, onCancel }: Props) => {
  return (
    <Form form={vm} onSubmit={onSubmit} onCancel={onCancel}>
      <YearPlansControl vm={vm.yearPlans} />
    </Form>
  );
};
