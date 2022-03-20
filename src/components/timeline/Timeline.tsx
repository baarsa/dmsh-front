import { TimelineVM } from "../../view-models/TimelineVM";
import { MouseEventHandler, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";

import "./Timeline.css";
import { observer } from "mobx-react-lite";
import { createCn, getTimeText } from "../../utils";

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

  const getMinutesFromXCoord = (element: HTMLDivElement, x: number) => {
    const scale = (dayEnd - dayStart) / element.offsetWidth;
    const xWithinRibbon = x - element.getBoundingClientRect().x;
    return dayStart + xWithinRibbon * scale;
  };
  const getSpanStyle = ({ start, end }: { start: number; end: number }) => {
    const left = (100 * (start - dayStart)) / (dayEnd - dayStart);
    const right = (100 * (end - dayStart)) / (dayEnd - dayStart);
    const width = right - left;
    return { left: `${left}%`, width: `${width}%` };
  };
  const handleMouseDown: MouseEventHandler = (e) => {
    if (!vm.canDrawSpan || e.button !== 0 || e.target !== e.currentTarget) {
      return;
    }
    vm.drawingSpan = {
      initialX: e.nativeEvent.offsetX,
      currentX: e.nativeEvent.offsetX,
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
      const newStart = getMinutesFromXCoord(
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
      currentX: e.nativeEvent.pageX - ref.current.getBoundingClientRect().x,
    };
  };
  const handleMouseUp: MouseEventHandler = () => {
    if (ref.current === null || vm.drawingSpan === null) {
      //error
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
    const width = ref.current.offsetWidth;
    vm.handleSpanDrawingEnd({
      start: Math.round(dayStart + (startX / width) * (dayEnd - dayStart)),
      end: Math.round(dayStart + (endX / width) * (dayEnd - dayStart)),
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
              vm.handleSpanDrag(span.id, span.start);
            }}
          >
            <CloseIcon
              className={cn("span-cross")}
              onClick={() => vm.handleSpanCrossClick(span.id, span.type)}
            />
            {span.text}
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
