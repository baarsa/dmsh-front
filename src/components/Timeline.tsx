import {TimelineVM} from "../view-models/TimelineVM";
import {MouseEventHandler, useRef} from "react";

import './Timeline.css';
import {observer} from "mobx-react-lite";
import {createCn} from "../utils";

const TIME_START = 10 * 60;
const TIME_END = 20 * 60;

const getSpanStyle = ({ start, end }: { start: number; end: number }) => {
    const left = 100 * (start - TIME_START) / (TIME_END - TIME_START);
    const right = 100 * (end - TIME_START) / (TIME_END - TIME_START);
    const width = right - left;
    return { left: `${left}%`, width: `${width}%` };
}

const getDrawingSpanStyle = ({ initialX, currentX }: { initialX: number; currentX: number }) => {
    const left = initialX < currentX ? initialX : currentX;
    const width = Math.abs(initialX - currentX);
    return { left: `${left}px`, width: `${width}px` };
};

const timeline = createCn('timeline');

export const Timeline = observer((props: { vm: TimelineVM }) => {
    const ref = useRef<HTMLDivElement>(null);
    const handleMouseDown: MouseEventHandler = (e) => {
        if (!props.vm.canDrawSpan) {
            return;
        }
        props.vm.drawingSpan = {
            initialX: e.nativeEvent.offsetX,
            currentX: e.nativeEvent.offsetX,
        };
    };
    const handleMouseMove: MouseEventHandler = (e) => {
        if (props.vm.drawingSpan === null) {
            return;
        }
        props.vm.drawingSpan = {
            initialX: props.vm.drawingSpan.initialX,
            currentX: e.nativeEvent.offsetX, // wrong, sometimes it's counted within draweing span.
        };
    };
    const handleMouseUp: MouseEventHandler = () => {
        if (ref.current === null || props.vm.drawingSpan === null) {
            //error
            return;
        }
        const startX = props.vm.drawingSpan.currentX < props.vm.drawingSpan.initialX
            ? props.vm.drawingSpan.currentX
            : props.vm.drawingSpan.initialX;
        const endX = props.vm.drawingSpan.currentX < props.vm.drawingSpan.initialX
            ? props.vm.drawingSpan.initialX
            : props.vm.drawingSpan.currentX;
        const width = ref.current.offsetWidth;
        props.vm.handleSpanDrawingEnd({
            start: Math.round(TIME_START + (startX / width) * (TIME_END - TIME_START)),
            end: Math.round(TIME_START + (endX / width) * (TIME_END - TIME_START)),
        });
    };
    return <div ref={ ref } onMouseDown={ handleMouseDown } onMouseUp={ handleMouseUp} onMouseMove={ handleMouseMove } className={ timeline() }>
        { props.vm.spans.map((span, i) => <div className={ timeline('span') } key={ i } style={ getSpanStyle(span) }>{ span.text }</div>) }
        { props.vm.drawingSpan && <div className="timeline__span" style={ getDrawingSpanStyle(props.vm.drawingSpan) } />}
    </div>
});