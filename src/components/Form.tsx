import { IFormModel } from "../view-models/forms/FormModel"; // todo separate file
import { Field } from "./fields/Field";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";

type Props = {
  form: IFormModel;
  onSubmit?: (newId: number) => void;
  onCancel?: () => void;
};

export const Form = observer(({ form, onSubmit, onCancel }: Props) => (
  <div>
    This is a form {form.title}
    {form.getFields().map((field, i) => (
      <Field key={i} field={field} />
    ))}
    {form.mode === "edit" && (
      <div>
        <Button
          disabled={!form.isValid()}
          onClick={async () => {
            const newId = await form.handleSubmit();
            if (onSubmit !== undefined) {
              onSubmit(newId);
            }
          }}
        >
          Сохранить
        </Button>
        <Button
          onClick={() => {
            form.handleCancel();
            if (onCancel !== undefined) {
              onCancel();
            }
          }}
        >
          Отмена
        </Button>
      </div>
    )}
  </div>
));
