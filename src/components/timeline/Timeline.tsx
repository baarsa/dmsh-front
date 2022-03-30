import { TimelineVM } from "../../view-models/TimelineVM";
import { MouseEventHandler, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";

import "./Timeline.css";
import { observer } from "mobx-react-lite";
import { createCn, getTimeText } from "../../utils";
import {Tooltip} from "@mui/material";

/**
 * Шаг, до которого округляются операции на шкале (в минутах)
 */
const SNAP_UNIT = 5;

/**
 * Округляет количество минут до SNAP_UNIT
 */
const getRoundedMinutes = (x: number) => {
  const remainder = x % SNAP_UNIT;
  return Math.round(x - remainder + (remainder > SNAP_UNIT / 2 ? SNAP_UNIT : 0));
}

const getDrawingSpanStyle = ({
  initialX,
  currentX,
}: {
  initialX: number;
  currentX: number;
}) => {
  const left = initialX < currentX ? initialX : currentX;
  const width = Math.abs(initialX - currentX);
  return { left: `${left}px`, width: `${width}px` };
};

const cn = createCn("timeline");

type TimeLabel = {
  time: number;
  isBig: boolean;
  text: string;
};

const getTimeLabels = (start: number, end: number): TimeLabel[] => {
  let labels: TimeLabel[] = [];
  for (let i = start; i <= end; i += 10) {
    labels.push({
      time: i,
      isBig: i % 60 === 0,
      text: i % 60 === 0 ? getTimeText(i) : "",
    });
  }
  return labels;
};

type Props = {
  vm: TimelineVM;
  className?: string;
};

export const Timeline = observer(({ vm, className }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { dayStart, dayEnd } = vm.timeBorders;

  /**
   * Масштаб шкалы (пиксель/минута)
   */
  const getScale = (element: HTMLDivElement) => element.offsetWidth / (dayEnd - dayStart);
  const getRibbonLeftOffset = (element: HTMLDivElement) => element.getBoundingClientRect().x

  const getMinutesFromXCoordWithinPage = (element: HTMLDivElement, x: number) => {
    const xWithinRibbon = x - getRibbonLeftOffset(element);
    return getMinutesFromXCoordWithinRibbon(element, xWithinRibbon);
  };
  const getMinutesFromXCoordWithinRibbon = (element: HTMLDivElement, x: number) => {
    return dayStart + Math.round(x / getScale(element));
  };
  const getXCoordWithinRibbonFromMinutes = (element: HTMLDivElement, x: number) => {
    return (x - dayStart) * getScale(element);
  };
  const getSpanStyle = ({ start, end }: { start: number; end: number }) => {
    const left = (100 * (start - dayStart)) / (dayEnd - dayStart);
    const right = (100 * (end - dayStart)) / (dayEnd - dayStart);
    const width = right - left;
    return { left: `${left}%`, width: `${width}%` };
  };
  const handleMouseDown: MouseEventHandler = (e) => {
    if (!vm.canDrawSpan || ref.current === null || e.button !== 0 || e.target !== e.currentTarget) {
      return;
    }
    const xMinutes = getMinutesFromXCoordWithinRibbon(ref.current, e.nativeEvent.offsetX);
    const xMinutesRounded = getRoundedMinutes(xMinutes);
    const xPixelsRounded = getXCoordWithinRibbonFromMinutes(ref.current, xMinutesRounded);
    vm.drawingSpan = {
      initialX: xPixelsRounded,
      currentX: xPixelsRounded,
    };
  };
  const handleMouseMove: MouseEventHandler = (e) => {
    if (ref.current === null) {
      return;
    }
    if (vm.draggingSpan !== null) {
      const draggingSpan = vm.spans.find(
        (span) => span.id === vm.draggingSpan?.id
      );
      if (draggingSpan === undefined) {
        throw new Error();
      }
      const newStart = getMinutesFromXCoordWithinPage(
        ref.current,
        e.nativeEvent.pageX - vm.draggingSpan.dragOffsetX
      );
      const newEnd = newStart + (draggingSpan.end - draggingSpan.start);
      if (newStart < dayStart || newEnd > dayEnd) {
        return;
      }
      vm.spans = [
        ...vm.spans.filter((span) => span.id !== draggingSpan.id),
        { ...draggingSpan, start: newStart, end: newEnd },
      ];
      return;
    }
    if (vm.drawingSpan === null) {
      return;
    }
    vm.drawingSpan = {
      initialX: vm.drawingSpan.initialX,
      currentX: e.nativeEvent.pageX - getRibbonLeftOffset(ref.current),
    };
  };
  const handleMouseUp: MouseEventHandler = () => {
    if (ref.current === null || vm.drawingSpan === null) {
      return;
    }
    const startX =
      vm.drawingSpan.currentX < vm.drawingSpan.initialX
        ? vm.drawingSpan.currentX
        : vm.drawingSpan.initialX;
    const endX =
      vm.drawingSpan.currentX < vm.drawingSpan.initialX
        ? vm.drawingSpan.initialX
        : vm.drawingSpan.currentX;
    const startMinutes = Math.round(dayStart + startX / getScale(ref.current));
    const endMinutes = Math.round(dayStart + endX / getScale(ref.current));
    vm.handleSpanDrawingEnd({
      start: getRoundedMinutes(startMinutes),
      end: getRoundedMinutes(endMinutes),
    });
  };
  return (
    <div className={`${cn()} ${className}`}>
      <div
        ref={ref}
        className={cn("ribbon")}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {vm.spans.map((span, i) => (
          <div
            className={cn("span", { [span.type]: true })}
            key={i}
            style={getSpanStyle(span)}
            onMouseDown={(e) => {
              vm.draggingSpan = {
                id: span.id,
                dragOffsetX: e.nativeEvent.offsetX,
                initialStart: span.start,
                initialEnd: span.end,
              };
            }}
            onMouseUp={(e) => {
              if (vm.draggingSpan === null || ref.current === null) {
                return;
              }
              span.start = getRoundedMinutes(span.start);
              vm.handleSpanDrag(span.id, span.start);
            }}
          >
            <CloseIcon
              className={cn("span-cross")}
              onClick={() => {
                vm.handleSpanCrossClick(span.id, span.type);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            />
            <Tooltip title={ span.text ?? '' }>
              <div className={cn('span-text')}>
                {span.text}
              </div>
            </Tooltip>
          </div>
        ))}
        {vm.drawingSpan && (
          <div
            className={cn("span", { drawing: true })}
            style={getDrawingSpanStyle(vm.drawingSpan)}
          />
        )}
      </div>
      <div className={cn("labels")}>
        {getTimeLabels(dayStart, dayEnd).map((item, i) => (
          <div
            key={i}
            className={cn("label", { big: item.isBig })}
            style={{
              left: `${(100 * (item.time - dayStart)) / (dayEnd - dayStart)}%`,
            }}
          >
            <div className={cn("label-line")} />
            <div className={cn("label-text")}>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
});
