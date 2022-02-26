import { ITimeSpan } from "./ITimeSpan";

export interface IExtraEmployment extends ITimeSpan {
  person: number;
  description: string;
}
