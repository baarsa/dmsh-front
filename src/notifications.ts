import { Store } from "react-notifications-component";

export const addError = (text: string) =>
  Store.addNotification({
    type: "danger",
    title: "Ошибка!",
    message: `Ошибка: ${text}`,
    container: "top-right",
    animationIn: ["animate__animated", "animate__slideInDown"],
    animationOut: ["animate__animated", "animate__slideOutUp"],
    dismiss: {
      duration: 2000,
    },
  });
