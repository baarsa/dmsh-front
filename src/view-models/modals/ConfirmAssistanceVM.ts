import {LinkFieldVM} from "../fields/LinkField";
import {teacherRepository} from "../../models/teacher/TeacherRepository";
import {TeacherEntity} from "../../models/teacher/TeacherEntity";
import {ModalVM} from "./ModalVM";
import {makeObservable, observable} from "mobx";

type SubmitParameters = {
    start: number;
    end: number;
    teacher: number;
};

type ConfirmAssistanceParameters = {
    onSubmit: (parameters: SubmitParameters) => void;
    onClose: () => void;
    lessonStart: number;
    lessonEnd: number;
    mainTeacher: string;
    taker: string;
    subject: string;
    weekDay: string;
};

export class ConfirmAssistanceVM extends ModalVM {
    get mainTeacher(): string {
        return this._mainTeacher;
    }

    get taker(): string {
        return this._taker;
    }

    get subject(): string {
        return this._subject;
    }

    get weekDay(): string {
        return this._weekDay;
    }

    get assistant(): LinkFieldVM<TeacherEntity> {
        return this._assistant;
    }
    get start(): number {
        return this._start;
    }

    set start(value: number) {
        this._start = value;
    }

    get end(): number {
        return this._end;
    }

    set end(value: number) {
        this._end = value;
    }

    isStartValid() {
        return (
            this._start >= this._lessonStart
        );
    }

    isEndValid() {
        return (
            this._end <= this._lessonEnd
        );
    }

    isFormValid() {
        return (
            this.isStartValid() &&
            this.isEndValid() &&
            this._assistant.isValid() &&
            this._start < this._end
        );
    }

    private readonly _lessonStart: number;
    private _start: number;
    private readonly _lessonEnd: number;
    private _end: number;
    private readonly _mainTeacher: string;
    private readonly _taker: string;
    private readonly _subject: string;
    private readonly _weekDay: string;
    private readonly _assistant: LinkFieldVM<TeacherEntity> = new LinkFieldVM<TeacherEntity>(
        { label: "Иллюстратор/концертмейстер" },
        {
            entityModel: teacherRepository,
            entitiesFilter: (teacher) => teacher.canAssist,
        }
    )

    handleConfirm() {
        const selectedTeacher = this._assistant.value;
        if (selectedTeacher === null) {
            throw new Error("No teacher selected");
        }
        this._onSubmit({
            start: this._start - this._lessonStart,
            end: this._end - this._lessonStart,
            teacher: selectedTeacher.id,
        });
    }
    private readonly _onSubmit: (parameters: SubmitParameters) => void;

    constructor({
                    lessonStart,
                    lessonEnd,
                    onClose,
                    onSubmit,
                    mainTeacher,
                    taker,
                    subject,
                    weekDay,
                }: ConfirmAssistanceParameters) {
        super(onClose);
        this._lessonStart = lessonStart;
        this._start = lessonStart;
        this._lessonEnd = lessonEnd;
        this._end = lessonEnd;
        this._mainTeacher = mainTeacher;
        this._taker = taker;
        this._weekDay = weekDay;
        this._onSubmit = onSubmit;
        this._subject = subject;
        makeObservable<ConfirmAssistanceVM, "_start" | "_end">(this, {
            _start: observable,
            _end: observable,
        });
    }
}