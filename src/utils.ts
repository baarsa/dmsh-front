import { withNaming } from "@bem-react/classname";

export const createCn = withNaming({ e: "__", m: "_", v: "_" });

export const getTimeText = (time: number) => {
  const hours = Math.floor(time / 60);
  let minutes = String(time % 60);
  if (minutes.length === 1) {
    minutes = "0" + minutes;
  }
  return `${hours}:${minutes}`;
};

export const parseTimeText = (text: string) => {
  const parts = text.split(":");
  return Number(parts[0]) * 60 + Number(parts[1]); // TODO: handle errors
};

export const formatHalfHours = (value: number) => `${value / 2} ${ value === 2 ? "час" : "часа"}`;

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};
