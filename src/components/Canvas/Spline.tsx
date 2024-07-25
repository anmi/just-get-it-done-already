import { Component, createMemo, Show } from "solid-js";
import "./Spline.css";
import { Point } from "../../models/Point";
import { classes } from "../../utils/classes";

interface SplineProps {
  removeVisible: boolean;
  onRemoveClick(): void;
  from: Point;
  to: Point;
  muted: boolean;
}

function minLeft(from: Point, to: Point) {
  return Math.min(from.x, to.x);
}

function minTop(from: Point, to: Point) {
  return Math.min(from.y, to.y);
}

function avg(a: number, b: number) {
  return (a + b) / 2;
}

const GAP = 20;

interface GetPathParams {
  before: number;
  after: number;
  from: Point;
  to: Point;
}

function movePointX(point: Point, offset: number) {
  return {
    x: point.x + offset,
    y: point.y
  }
}

function getPath(props: GetPathParams): string {
  // const { from, to } = props;
  const from = movePointX(props.from, props.before)
  const to = movePointX(props.to, -props.after)
  const x0 = GAP
  const sx0 = x0 + props.before;
  const y0 = GAP;
  const midy = Math.abs((from.y - to.y) / 2) + GAP;
  const midx = Math.abs((from.x - to.x) / 2) + GAP + props.before;
  const xOff = Math.abs(from.x - to.x) + GAP;
  const sxOff = xOff + props.before
  const yOff = Math.abs(from.y - to.y) + GAP;
  if (from.y < to.y) {
    return `M${x0},${y0} L${sx0},${y0} C${midx},${y0} ${midx},${yOff} ${sxOff},${yOff} L${sxOff+props.after},${yOff}`;
  } else {
    return `M${x0},${yOff} L${sx0},${yOff} C${midx},${yOff} ${midx},${y0} ${sxOff},${y0} L${sxOff + props.after},${y0}`
  }
}

export const Spline: Component<SplineProps> = (props) => {
  const pos = createMemo(() => {
    if (props.from.x < props.to.x) {
      return {
        after: props.muted ? 0 :
          props.to.x - props.from.x - 200,
        before: 0,
        from: props.from,
        to: props.to,
      }
    } else {
      return {
        before: props.muted ? 0 :
          props.from.x - props.to.x - 200,
        after: 0,
        to: props.from,
        from: props.to,
      }
    }
  })
  return (
    <div
      class="Spline"
      style={{
        top: minTop(pos().from, pos().to) - GAP + "px",
        left: minLeft(pos().from, pos().to) - GAP + "px",
      }}
    >
      <svg
        width={Math.abs(pos().from.x - pos().to.x) + 2 * GAP}
        height={Math.abs(pos().from.y - pos().to.y) + 2 * GAP}
        stroke="#777"
        opacity={props.muted ? '30%' : '60%'}
        stroke-width={1}
        class={classes(props.removeVisible && "Spline__path_highlighted")}
      >
        <path d={getPath(pos())} fill="transparent" />
      </svg>
      <Show when={props.removeVisible}>
        <div
          class="Spline__remove"
          style={{
            // left: GAP + Math.abs(props.to.x - props.from.x) / 2 + "px",
            // top: GAP + Math.abs((props.from.y - props.to.y) / 2) - 5 + "px",
            left: GAP + Math.max(pos().to.x - pos().from.x, 0) - 4 + "px",
            top: GAP + Math.abs(pos().from.y - pos().to.y) - 8 + "px",
          }}
          onClick={props.onRemoveClick}
        >
          ✕
        </div>
      </Show>
    </div>
  );
};
