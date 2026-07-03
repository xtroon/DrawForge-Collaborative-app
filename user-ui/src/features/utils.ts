import type { Shape, Point } from "./types";

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
