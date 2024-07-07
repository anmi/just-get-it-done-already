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
  from: Point;
  to: Point;
}

function getPath(props: GetPathParams): string {
  const { from, to } = props;
  const x0 = GAP;
  const y0 = GAP;
  const midy = Math.abs((from.y - to.y) / 2) + GAP;
  const midx = Math.abs((from.x - to.x) / 2) + GAP;
  const xOff = Math.abs(from.x - to.x) + GAP;
  const yOff = Math.abs(from.y - to.y) + GAP;
  if (from.y < to.y) {
    return `M${x0},${y0} C${midx},${y0} ${midx},${yOff} ${xOff},${yOff}`;
  } else {
    return `M${xOff},${y0} C${midx},${y0} ${midx},${yOff} ${y0},${yOff}`;
  }
}

export const Spline: Component<SplineProps> = (props) => {
  const pos = createMemo(() => {
    if (props.from.x < props.to.x) {
      return {
        from: props.from,
        to: props.to,
      }
    } else {
      return {
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
