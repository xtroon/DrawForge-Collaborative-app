import type { Shape } from "./types";

function distanceToLineSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
    const l2 = (x1 - x2) ** 2 + (y1 - y2) ** 2;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

export function isShapeHit(shape: Shape, x: number, y: number, threshold: number = 10): boolean {
    if (shape.type === "pencil" || shape.type === "brush") {
        for (let i = 1; i < shape.points.length; i++) {
            const p1 = shape.points[i - 1];
            const p2 = shape.points[i];
            if (distanceToLineSegment(x, y, p1.x, p1.y, p2.x, p2.y) <= threshold) {
                return true;
            }
        }
        return false;
    }

    if (shape.type === "line") {
        return distanceToLineSegment(x, y, shape.start.x, shape.start.y, shape.end.x, shape.end.y) <= threshold;
    }

    if (shape.type === "eraser") {
        for (let i = 1; i < shape.points.length; i++) {
            const p1 = shape.points[i - 1];
            const p2 = shape.points[i];
            if (distanceToLineSegment(x, y, p1.x, p1.y, p2.x, p2.y) <= threshold) {
                return true;
            }
        }
        return false;
    }

    if (shape.type === "text") {
        const bb = getBoundingBox(shape);
        return x >= bb.minX && x <= bb.maxX && y >= bb.minY && y <= bb.maxY;
    }

    // For other shapes, we'll approximate using bounding box edges or the actual shape edges
    const minX = Math.min(shape.start.x, shape.end.x);
    const maxX = Math.max(shape.start.x, shape.end.x);
    const minY = Math.min(shape.start.y, shape.end.y);
    const maxY = Math.max(shape.start.y, shape.end.y);

    if (shape.type === "rectangle" || shape.type === "rounded-rectangle") {
        const top = distanceToLineSegment(x, y, minX, minY, maxX, minY);
        const bottom = distanceToLineSegment(x, y, minX, maxY, maxX, maxY);
        const left = distanceToLineSegment(x, y, minX, minY, minX, maxY);
        const right = distanceToLineSegment(x, y, maxX, minY, maxX, maxY);
        return top <= threshold || bottom <= threshold || left <= threshold || right <= threshold;
    }

    if (shape.type === "circle") {
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const rx = (maxX - minX) / 2;
        const ry = (maxY - minY) / 2;
        // Simple ellipse distance approximation
        const dx = x - cx;
        const dy = y - cy;
        const normX = dx / (rx || 1);
        const normY = dy / (ry || 1);
        const distToCenter = Math.hypot(normX, normY);
        // The edge is where distToCenter == 1
        // We approximate the physical distance
        const rApprox = Math.hypot(rx, ry) / Math.SQRT2;
        const actualDist = Math.abs(distToCenter - 1) * rApprox;
        return actualDist <= threshold;
    }
    
    if (shape.type === "rhombus") {
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const d1 = distanceToLineSegment(x, y, cx, minY, maxX, cy);
        const d2 = distanceToLineSegment(x, y, maxX, cy, cx, maxY);
        const d3 = distanceToLineSegment(x, y, cx, maxY, minX, cy);
        const d4 = distanceToLineSegment(x, y, minX, cy, cx, minY);
        return d1 <= threshold || d2 <= threshold || d3 <= threshold || d4 <= threshold;
    }

    if (shape.type === "arrow") {
        const lineDist = distanceToLineSegment(x, y, shape.start.x, shape.start.y, shape.end.x, shape.end.y);
        // Approximate head by just expanding threshold near end point
        return lineDist <= threshold || Math.hypot(x - shape.end.x, y - shape.end.y) <= threshold * 2;
    }

    return false;
}

export function getBoundingBox(shape: Shape): { minX: number; minY: number; maxX: number; maxY: number } {
    if (shape.type === "pencil" || shape.type === "brush" || shape.type === "eraser") {
        if (shape.points.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        let minX = shape.points[0].x;
        let maxX = shape.points[0].x;
        let minY = shape.points[0].y;
        let maxY = shape.points[0].y;
        for (const p of shape.points) {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        }
        return { minX, minY, maxX, maxY };
    } else if (shape.type === "text") {
        // Approximate width and height since we don't have measureText here
        const lines = shape.text.split('\n');
        const height = lines.length * shape.fontSize * 1.2;
        const maxLen = Math.max(...lines.map(l => l.length));
        const width = maxLen * (shape.fontSize * 0.6); // roughly 0.6em width per char
        return {
            minX: shape.position.x,
            minY: shape.position.y,
            maxX: shape.position.x + width,
            maxY: shape.position.y + height
        };
    } else {
        return {
            minX: Math.min(shape.start.x, shape.end.x),
            minY: Math.min(shape.start.y, shape.end.y),
            maxX: Math.max(shape.start.x, shape.end.x),
            maxY: Math.max(shape.start.y, shape.end.y)
        };
    }
}

export function translateShape(shape: Shape, dx: number, dy: number): Shape {
    if (shape.type === "pencil" || shape.type === "brush" || shape.type === "eraser") {
        return {
            ...shape,
            points: shape.points.map(p => ({ x: p.x + dx, y: p.y + dy }))
        };
    } else if (shape.type === "text") {
        return {
            ...shape,
            position: { x: shape.position.x + dx, y: shape.position.y + dy }
        };
    } else {
        return {
            ...shape,
            start: { x: shape.start.x + dx, y: shape.start.y + dy },
            end: { x: shape.end.x + dx, y: shape.end.y + dy }
        } as any;
    }
}

export function resizeShape(shape: Shape, handle: string, dx: number, dy: number): Shape {
    if (shape.type === "text") {
        // Just move the position if resizing text, maybe scale fontSize but that's complex
        // For simplicity, text doesn't resize by handles easily without layout, but we'll try basic scale
        if (handle === "se") {
            const newSize = Math.max(10, shape.fontSize + dy * 0.5);
            return { ...shape, fontSize: newSize };
        }
        return shape;
    }

    if (shape.type === "pencil" || shape.type === "brush" || shape.type === "eraser") {
        // Path resizing
        const bb = getBoundingBox(shape);
        const width = bb.maxX - bb.minX;
        const height = bb.maxY - bb.minY;
        if (width === 0 || height === 0) return shape;

        let newMinX = bb.minX;
        let newMaxX = bb.maxX;
        let newMinY = bb.minY;
        let newMaxY = bb.maxY;

        if (handle.includes("n")) newMinY += dy;
        if (handle.includes("s")) newMaxY += dy;
        if (handle.includes("w")) newMinX += dx;
        if (handle.includes("e")) newMaxX += dx;

        const scaleX = (newMaxX - newMinX) / width;
        const scaleY = (newMaxY - newMinY) / height;

        return {
            ...shape,
            points: shape.points.map(p => ({
                x: newMinX + (p.x - bb.minX) * scaleX,
                y: newMinY + (p.y - bb.minY) * scaleY
            }))
        };
    }

    // Start/End shapes
    let { start, end } = shape;
    // We want to apply dx,dy to the bounding box corners and update start/end
    // A trick is to determine if start is minX or maxX
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    let newMinX = minX;
    let newMaxX = maxX;
    let newMinY = minY;
    let newMaxY = maxY;

    if (handle.includes("n")) newMinY += dy;
    if (handle.includes("s")) newMaxY += dy;
    if (handle.includes("w")) newMinX += dx;
    if (handle.includes("e")) newMaxX += dx;

    // Preserve orientation (if start was minX, it stays minX, but if they cross, they swap)
    let newStartX = start.x === minX ? newMinX : newMaxX;
    let newEndX = end.x === maxX ? newMaxX : newMinX;
    let newStartY = start.y === minY ? newMinY : newMaxY;
    let newEndY = end.y === maxY ? newMaxY : newMinY;

    if (shape.type === "line" || shape.type === "arrow") {
         return {
            ...shape,
            start: { x: newStartX, y: newStartY },
            end: { x: newEndX, y: newEndY }
        } as any;
    }

    return {
        ...shape,
        start: { x: newStartX, y: newStartY },
        end: { x: newEndX, y: newEndY }
    } as any;
}

export function getHandleHit(bb: { minX: number; minY: number; maxX: number; maxY: number }, x: number, y: number, zoom: number): string | null {
    // scale handle size inversely to zoom, so it appears constant on screen
    const handleSize = 8 / (zoom / 100);
    const h = handleSize / 2;

    const handles = [
        { id: "nw", x: bb.minX, y: bb.minY },
        { id: "ne", x: bb.maxX, y: bb.minY },
        { id: "sw", x: bb.minX, y: bb.maxY },
        { id: "se", x: bb.maxX, y: bb.maxY },
        { id: "n", x: (bb.minX + bb.maxX) / 2, y: bb.minY },
        { id: "s", x: (bb.minX + bb.maxX) / 2, y: bb.maxY },
        { id: "e", x: bb.maxX, y: (bb.minY + bb.maxY) / 2 },
        { id: "w", x: bb.minX, y: (bb.minY + bb.maxY) / 2 }
    ];

    for (const handle of handles) {
        if (x >= handle.x - h && x <= handle.x + h && y >= handle.y - h && y <= handle.y + h) {
            return handle.id;
        }
    }
    return null;
}
