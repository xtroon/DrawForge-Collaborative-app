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