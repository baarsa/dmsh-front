import { IFormModel } from "../../../view-models/forms/FormModel"; // todo separate file
import { Field } from "../../fields/Field";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { Button } from "../../button/Button";
import { createCn } from "../../../utils";
import "./Form.css";

type Props = {
  form: IFormModel;
  onSubmit?: (newId: number) => void;
  onCancel?: () => void;
  children?: ReactNode;
  additionalButtons?: ReactNode;
};

const cn = createCn("form");

export const Form = observer(
  ({ form, onSubmit, onCancel, children, additionalButtons }: Props) => {
    const navigate = useNavigate();
    return (
      <div className={cn()}>
        <div className={cn("title")}>{form.title}</div>
        {form
          .getFields()
          .map(
            (field, i) => field.isVisible && <Field key={i} field={field} />
          )}
        {children}
        <div className={cn("buttons")}>
          {form.mode === "edit" && (
            <>
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
            </>
          )}
          {form.mode === "view" && (
            <>
                {
                    additionalButtons
                }
            <Button
              onClick={() => {
                navigate("edit");
              }}
            >
              Редактировать
            </Button>
            <Button
                onClick={() => {
                    form.handleDelete();
                    navigate("..");
                }}
            >
                Удалить
            </Button>
            </>
          )}
        </div>
      </div>
    );
  }
);
