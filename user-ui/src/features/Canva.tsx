import { useEffect, useRef, useState } from "react";
import { pencil, rectangle, circle, line, redrawCanvas } from "./draw";
import type { Shape, Point } from "./types";

type CanvasProps = {
  tool: "pencil" | "rectangle" | "circle" | "line";
};

export default function Canvas({ tool }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);
  const currentPathRef = useRef<Point[]>([]);

  const [drawing, setDrawing] = useState(false);
  const [prevPoint, setPrevPoint] = useState({ x: 0, y: 0 });

  const [shapes, setShapes] = useState<Shape[]>([]);

  

  useEffect(() => {
    const canvas = canvasRef.current;
    // console.log(canvas)
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    if (!ctx || !canvas) return;

    redrawCanvas(ctx, canvas, shapes);
  }, [shapes]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    // console.log(offsetX, offsetY)
    setPrevPoint({
      x: offsetX,
      y: offsetY,
    });
    currentPathRef.current = [{ x: offsetX, y: offsetY }];

    if (ctxRef.current && canvasRef.current) {
      snapshotRef.current = ctxRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
    }

    setDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;

    const ctx = ctxRef.current;
    if (!ctx) return;

    const { offsetX, offsetY } = e.nativeEvent;
    // console.log(offsetX, offsetY)

    if (tool === "pencil") {
      pencil(ctx, prevPoint, {
        x: offsetX,
        y: offsetY,
      });
      setPrevPoint({
        x: offsetX,
        y: offsetY,
      });
      currentPathRef.current.push({ x: offsetX, y: offsetY });
    }

    if (tool === "rectangle") {
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }
      rectangle(ctx, prevPoint, {
        x: offsetX,
        y: offsetY,
      });
    }

    if (tool === "circle") {
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }
      circle(ctx, prevPoint, {
        x: offsetX,
        y: offsetY,
      });
    }

    if (tool === "line") {
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }
      line(ctx, prevPoint, {
        x: offsetX,
        y: offsetY,
      });
    }
  };

  const handleMouseUp = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "rectangle") {
      setShapes((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "rectangle",
          start: prevPoint,
          end: {
            x: offsetX,
            y: offsetY,
          },
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
          end: {
            x: offsetX,
            y: offsetY,
          },
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
          end: {
            x: offsetX,
            y: offsetY,
          },
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

  useEffect(() => {
    console.log(shapes);
  }, [shapes]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 bg-gray-200"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}
