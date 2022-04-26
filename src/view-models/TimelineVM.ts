import { computed, makeObservable, observable } from "mobx";
import { configStore } from "../models/config-store/ConfigStore";

export type SpanType = "lesson" | "extra"; // TODO: move;

const MINIMAL_SPAN_LENGTH = 5; // в минутах

export type Span = {
  id: number;
  start: number;
  end: number;
  type: SpanType;
  text?: string;
  longText?: string;
  persons: number[];
};

export type DrawingSpan = {
  initialX: number;
  currentX: number;
};

type DraggingSpan = {
  id: number;
  dragOffsetX: number;
  initialStart: number;
  initialEnd: number;
};

export class TimelineVM {
  get draggingSpan(): DraggingSpan | null {
    return this._draggingSpan;
  }

  set draggingSpan(value: DraggingSpan | null) {
    this._draggingSpan = value;
  }
  get canDrawSpan(): boolean {
    return this._canDrawSpan;
  }

  set canDrawSpan(value: boolean) {
    this._canDrawSpan = value;
  }

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

  get timeBorders() {
    return {
      dayStart: configStore.config?.startTime ?? 0,
      dayEnd: configStore.config?.endTime ?? 0, // TODO: fix
    };
  }

  private _spans: Span[];
  _drawingSpan: DrawingSpan | null = null;
  private readonly _onSpanDrawingEnd: (params: {
    start: number;
    end: number;
  }) => Promise<void>;
  private readonly _onSpanCrossClick: (id: number, type: SpanType) => void =
    () => {};
  private readonly _onSpanChange: (
    id: number,
    type: SpanType,
    start: number,
    end: number
  ) => Promise<boolean>;
  private _canDrawSpan = true;
  private _draggingSpan: DraggingSpan | null = null;

  async handleSpanDrawingEnd(params: { start: number; end: number }) {
    if (params.end - params.start < MINIMAL_SPAN_LENGTH) {
      this._drawingSpan = null;
      return; // todo maybe show some notification
    }
    await this._onSpanDrawingEnd(params);
    this._drawingSpan = null; // TODO: add preloader animation?
  }

  handleSpanCrossClick(id: number, type: SpanType) {
    this._onSpanCrossClick(id, type);
  }

  async handleSpanDrag(id: number, newStart: number) {
    const span = this._spans.find((span) => span.id === id);
    if (span === undefined || this.draggingSpan === null) {
      throw new Error(); // TODO: handle
    }
    const { initialStart, initialEnd } = this.draggingSpan;
    this.draggingSpan = null;
    const wasUpdated = await this._onSpanChange(
      id,
      span.type,
      newStart,
      span.end + (newStart - span.start)
    );
    if (!wasUpdated) {
      this._spans = [
        ...this._spans.filter(({ id }) => id !== span.id),
        { ...span, start: initialStart, end: initialEnd },
      ];
    }
  }

  constructor(params: {
    spans: Span[];
    onSpanDrawingEnd: (params: { start: number; end: number }) => Promise<void>;
    onSpanCrossClick?: (id: number, type: SpanType) => void;
    onSpanChange?: (
      id: number,
      type: SpanType,
      newStart: number,
      newEnd: number
    ) => Promise<boolean>;
  }) {
    this._spans = params.spans;
    this._onSpanDrawingEnd = params.onSpanDrawingEnd;
    this._onSpanCrossClick = params.onSpanCrossClick ?? (() => {});
    this._onSpanChange = params.onSpanChange ?? (() => Promise.resolve(true));
    makeObservable<TimelineVM, "_spans">(this, {
      _spans: observable,
      spans: computed,
      _drawingSpan: observable,
    });
  }
}
