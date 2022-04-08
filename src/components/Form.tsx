import { IFormModel } from "../view-models/forms/FormModel"; // todo separate file
import { Field } from "./fields/Field";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
  form: IFormModel;
  onSubmit?: (newId: number) => void;
  onCancel?: () => void;
};

export const Form = observer(({ form, onSubmit, onCancel }: Props) => {
  const navigate = useNavigate();
  return (
    <div>
      {form.title}
      {form
        .getFields()
        .map((field, i) => field.isVisible && <Field key={i} field={field} />)}
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
      {form.mode === "view" && (
        <div>
          <Button
            onClick={() => {
              navigate("edit");
            }}
          >
            Редактировать
          </Button>
        </div>
      )}
    </div>
  );
});
