import {computed, makeObservable, observable} from "mobx";

type Span = {
    start: number;
    end: number;
    text?: string;
};

type DrawingSpan = {
    initialX: number;
    currentX: number;
}

export class TimelineVM {
    private _spans: Span[];
    _drawingSpan: DrawingSpan | null = null;
    private readonly _onSpanDrawingEnd: (params: { start: number; end: number }) => void;
    // + on span dragging end
    // + on span right click (delete)

    get spans() {
        return this._spans;
    }
    set spans(newSpans: Span[]) {
        this._spans = newSpans;
    }
    get drawingSpan() {
        return this._drawingSpan;
    }
    set drawingSpan(newDrawingSpan) {
         this._drawingSpan = newDrawingSpan;
    }
    handleSpanDrawingEnd(params: { start: number; end: number }) {
        this._onSpanDrawingEnd(params);
        this._drawingSpan = null; // TODO: make async, add preloader animation?
    }

    constructor(params: { spans: Span[]; onSpanDrawingEnd: (params: { start: number; end: number }) => void }) {
        this._spans = params.spans;
        this._onSpanDrawingEnd = params.onSpanDrawingEnd;
        makeObservable<TimelineVM, '_spans'>(this, {
            _spans: observable,
            spans: computed,
            _drawingSpan: observable,
        });
    }
}