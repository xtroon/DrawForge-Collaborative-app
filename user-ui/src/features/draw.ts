import type { Point } from "./types.ts";

export function pencil(
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point
) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

export function rectangle(
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point
) {
    const width = end.x - start.x;
    const height = end.y - start.y;

    ctx.beginPath();
    ctx.rect(start.x, start.y, width, height);
    ctx.stroke();
}

export function circle(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point
) {
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  const centerX = (start.x + end.x) / 2;
  const centerY = (start.y + end.y) / 2;

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);
  ctx.stroke();
}