import { TimelineVM } from "../../view-models/TimelineVM";
import { MouseEventHandler, useRef } from "react";

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
  const getSpanStyle = ({ start, end }: { start: number; end: number }) => {
    const left = (100 * (start - dayStart)) / (dayEnd - dayStart);
    const right = (100 * (end - dayStart)) / (dayEnd - dayStart);
    const width = right - left;
    return { left: `${left}%`, width: `${width}%` };
  };
  const handleMouseDown: MouseEventHandler = (e) => {
    if (!vm.canDrawSpan || e.button !== 0) {
      return;
    }
    vm.drawingSpan = {
      initialX: e.nativeEvent.offsetX,
      currentX: e.nativeEvent.offsetX,
    };
  };
  const handleMouseMove: MouseEventHandler = (e) => {
    if (vm.drawingSpan === null || ref.current === null) {
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
          >
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
        {getTimeLabels(dayStart, dayEnd).map((item) => (
          <div
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
