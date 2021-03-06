import { LoginVM } from "../../view-models/pages/LoginVM";
import { StringField } from "../../components/fields/StringField";
import {Button, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { createCn } from "../../utils";
import "./Login.css";

const cn = createCn("login");

export const Login = observer(() => {
  const [vm] = useState(() => new LoginVM());
  const navigate = useNavigate();
  return (
    <form
      className={cn()}
      onSubmit={async (e) => {
        e.preventDefault();
        if (vm.isSubmitDisabled) {
          return;
        }
        const success = await vm.handleSubmit();
        if (success) {
          navigate("/");
        }
      }}
    >
      <Typography variant="h5" component="div">
          Вход в систему
      </Typography>
      <StringField field={vm.loginField} />
      <StringField field={vm.passwordField} type="password" />
      <Button type="submit" disabled={vm.isSubmitDisabled}>
        Войти
      </Button>
    </form>
  );
});
