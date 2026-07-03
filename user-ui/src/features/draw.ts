import type { Point, Shape } from "./types.ts";

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

export function line(
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point
) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

export function roundedRectangle(
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point
) {
    const width = end.x - start.x;
    const height = end.y - start.y;
    const radius = 10;
    ctx.beginPath();
    ctx.roundRect(start.x, start.y, width, height, radius);
    ctx.stroke();
}

export function rhombus(
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point
) {
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);
    
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    ctx.beginPath();
    ctx.moveTo(midX, minY);
    ctx.lineTo(maxX, midY);
    ctx.lineTo(midX, maxY);
    ctx.lineTo(minX, midY);
    ctx.closePath();
    ctx.stroke();
}

export function arrow(
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point
) {
    const headlen = 15;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

export function redrawCanvas(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    shapes: Shape[],
    pan = { x: 0, y: 0 },
    zoom = 100
) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.save();
    const scale = zoom / 100;
    ctx.setTransform(scale, 0, 0, scale, pan.x, pan.y);

    for (const shape of shapes) {
        if (shape.type !== "eraser") {
            ctx.strokeStyle = shape.color || "black";
        }
        ctx.lineWidth = shape.strokeWidth || 2;
        switch (shape.type) {
            case "rectangle":
                rectangle(ctx, shape.start, shape.end);
                break;
            case "circle":
                circle(ctx, shape.start, shape.end);
                break;
            case "line":
                line(ctx, shape.start, shape.end);
                break;
            case "rounded-rectangle":
                roundedRectangle(ctx, shape.start, shape.end);
                break;
            case "rhombus":
                rhombus(ctx, shape.start, shape.end);
                break;
            case "arrow":
                arrow(ctx, shape.start, shape.end);
                break;
            case "pencil":
            case "brush":
            case "eraser":
                if (shape.points && shape.points.length > 0) {
                    ctx.save();
                    if (shape.type === "eraser") {
                        ctx.globalCompositeOperation = "destination-out";
                        ctx.strokeStyle = "rgba(0,0,0,1)";
                    } else if (shape.type === "brush") {
                        ctx.shadowBlur = shape.strokeWidth * 1.5;
                        ctx.shadowColor = shape.color;
                    }
                    ctx.beginPath();
                    ctx.moveTo(shape.points[0].x, shape.points[0].y);
                    for (let i = 1; i < shape.points.length; i++) {
                        ctx.lineTo(shape.points[i].x, shape.points[i].y);
                    }
                    ctx.stroke();
                    ctx.restore();
                }
                break;
        }
    }
    
    ctx.restore();
}