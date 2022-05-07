import { ITimeSpan } from "./ITimeSpan";

export interface ILesson extends ITimeSpan {
  lessonTaker: number;
  teacher: number;
  subject: number;
  assistance?: {
    teacher: number;
    start: number;
    end: number;
  };
}
