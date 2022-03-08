import { ILesson } from "../../entities/ILesson";
import { IEntity, Stored } from "../shared";

export class LessonEntity implements IEntity, ILesson {
  id: number;
  schedule: number;
  weekDay: number;
  start: number;
  end: number;
  lessonTaker: number;
  teacher: number;
  subject: number;

  constructor(props: Stored<ILesson>) {
    this.id = props.id;
    this.schedule = props.schedule;
    this.weekDay = props.weekDay;
    this.start = props.start;
    this.end = props.end;
    this.lessonTaker = props.lessonTaker;
    this.teacher = props.teacher;
    this.subject = props.subject;
  }
}
export const createLessonEntity = (props: Stored<ILesson>) =>
  new LessonEntity(props);
