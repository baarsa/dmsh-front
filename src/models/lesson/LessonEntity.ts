import { ILesson } from "../../entities/ILesson";
import { Stored } from "../shared";

export class LessonEntity implements ILesson {
  id: number;
  schedule: number;
  weekDay: number;
  start: number;
  end: number;
  lessonTaker: number;
  teacher: number;
  subject: number;
  assistance?: {
    teacher: number;
    start: number;
    end: number;
  }

  constructor(props: Stored<ILesson>) {
    this.id = props.id;
    this.schedule = props.schedule;
    this.weekDay = props.weekDay;
    this.start = props.start;
    this.end = props.end;
    this.lessonTaker = props.lessonTaker;
    this.teacher = props.teacher;
    this.subject = props.subject;
    this.assistance = props.assistance;
  }
}
export const createLessonEntity = (props: Stored<ILesson>) =>
  new LessonEntity(props);
