import { useEffect, useRef, useState } from "react";
import { pencil, rectangle, circle, line, redrawCanvas } from "./draw";
import type { Shape, Point } from "./types";

type CanvasProps = {
  tool: "pointer" | "pencil" | "rectangle" | "circle" | "line";
  zoom: number;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
};

export default function Canvas({ tool, zoom, pan, setPan }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentPathRef = useRef<Point[]>([]);

  const [drawing, setDrawing] = useState(false);
  const [prevPoint, setPrevPoint] = useState({ x: 0, y: 0 });
  const [dragStartPoint, setDragStartPoint] = useState({ x: 0, y: 0 });

  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";
      ctxRef.current = ctx;

      redrawCanvas(ctx, canvas, shapes, pan, zoom);
    };

    // Initial setup
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [shapes, pan, zoom]);

  useEffect(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    if (!ctx || !canvas) return;

    redrawCanvas(ctx, canvas, shapes, pan, zoom);
  }, [shapes, pan, zoom]);

  const getWorldCoordinates = (clientX: number, clientY: number) => {
    const scale = zoom / 100;
    return {
      x: (clientX - pan.x) / scale,
      y: (clientY - pan.y) / scale,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === "pointer") {
      setDragStartPoint({ x: e.clientX, y: e.clientY });
      setDrawing(true);
      return;
    }

    const { x: worldX, y: worldY } = getWorldCoordinates(e.clientX, e.clientY);
    setPrevPoint({ x: worldX, y: worldY });
    currentPathRef.current = [{ x: worldX, y: worldY }];

    setDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing) return;

    if (tool === "pointer") {
      const dx = e.clientX - dragStartPoint.x;
      const dy = e.clientY - dragStartPoint.y;
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStartPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const { x: worldX, y: worldY } = getWorldCoordinates(e.clientX, e.clientY);

    if (tool === "pencil") {
      ctx.save();
      const scale = zoom / 100;
      ctx.setTransform(scale, 0, 0, scale, pan.x, pan.y);
      pencil(ctx, prevPoint, { x: worldX, y: worldY });
      ctx.restore();

      setPrevPoint({ x: worldX, y: worldY });
      currentPathRef.current.push({ x: worldX, y: worldY });
      return;
    }

    // For other shapes, clear and redraw everything, then draw temporary shape
    redrawCanvas(ctx, canvas, shapes, pan, zoom);

    ctx.save();
    const scale = zoom / 100;
    ctx.setTransform(scale, 0, 0, scale, pan.x, pan.y);

    if (tool === "rectangle") {
      rectangle(ctx, prevPoint, { x: worldX, y: worldY });
    }
    if (tool === "circle") {
      circle(ctx, prevPoint, { x: worldX, y: worldY });
    }
    if (tool === "line") {
      line(ctx, prevPoint, { x: worldX, y: worldY });
    }
    
    ctx.restore();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (tool === "pointer") {
      setDrawing(false);
      return;
    }

    // Only save shape if we were actually drawing one
    if (!drawing) return;

    const { x: worldX, y: worldY } = getWorldCoordinates(e.clientX, e.clientY);

    if (tool === "rectangle") {
      setShapes((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "rectangle",
          start: prevPoint,
          end: { x: worldX, y: worldY },
        },
      ]);
    }
    if (tool === "circle") {
      setShapes((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "circle",
          start: prevPoint,
          end: { x: worldX, y: worldY },
        },
      ]);
    }
    if (tool === "line") {
      setShapes((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "line",
          start: prevPoint,
          end: { x: worldX, y: worldY },
        },
      ]);
    }
    if (tool === "pencil") {
      setShapes((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "pencil",
          points: currentPathRef.current,
        },
      ]);
    }
    setDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 bg-gray-200 ${
        tool === "pointer"
          ? drawing ? "cursor-grabbing" : "cursor-grab"
          : "cursor-crosshair"
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}
