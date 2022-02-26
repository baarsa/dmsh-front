import { IFormModel } from "../view-models/forms/FormModel"; // todo separate file
import { Field } from "./fields/Field";

export const Form = (props: { form: IFormModel }) => (
  <div>
    This is a form {props.form.title}
    {props.form.getFields().map((field) => (
      <Field field={field} />
    ))}
    {props.form.mode === "edit" && (
      <button
        disabled={!props.form.isValid()}
        onClick={props.form.handleSubmit}
      >
        submit
      </button>
    )}
  </div>
);
