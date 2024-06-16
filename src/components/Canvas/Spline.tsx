import { Component, Show } from "solid-js";
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

function getPath(props: SplineProps): string {
  const { from, to } = props;
  const x0 = GAP;
  const y0 = GAP;
  const midy = Math.abs((from.y - to.y) / 2) + GAP;
  const xOff = Math.abs(from.x - to.x) + GAP;
  const yOff = Math.abs(from.y - to.y) + GAP;
  if (from.x < to.x) {
    return `M${x0},${y0} C${x0},${midy} ${xOff},${midy} ${xOff},${yOff}`;
  } else {
    return `M${xOff},${y0} C${xOff},${midy} ${x0},${midy} ${y0},${yOff}`;
  }
}

export const Spline: Component<SplineProps> = (props) => {
  return (
    <div
      class="Spline"
      style={{
        top: minTop(props.from, props.to) - GAP + "px",
        left: minLeft(props.from, props.to) - GAP + "px",
      }}
    >
      <svg
        width={Math.abs(props.from.x - props.to.x) + 2 * GAP}
        height={Math.abs(props.from.y - props.to.y) + 2 * GAP}
        stroke="#777"
        opacity={props.muted ? '40%' : '100%'}
        stroke-width={1}
        class={classes(props.removeVisible && "Spline__path_highlighted")}
      >
        <path d={getPath(props)} fill="transparent" />
      </svg>
      <Show when={props.removeVisible}>
        <div
          class="Spline__remove"
          style={{
            // left: GAP + Math.abs(props.to.x - props.from.x) / 2 + "px",
            // top: GAP + Math.abs((props.from.y - props.to.y) / 2) - 5 + "px",
            left: GAP + Math.max(props.to.x - props.from.x, 0) - 4 + "px",
            top: GAP + Math.abs(props.from.y - props.to.y) - 8 + "px",
          }}
          onClick={props.onRemoveClick}
        >
          ✕
        </div>
      </Show>
    </div>
  );
};
