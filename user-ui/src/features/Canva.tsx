import { useEffect, useRef, useState } from "react";
import { pencil, rectangle, circle } from "./draw";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);

  const [drawing, setDrawing] = useState(false);
  const [prevPoint, setPrevPoint] = useState({ x: 0, y: 0 });

  const [tool, setTool] = useState<"pencil" | "rectangle" | "circle">("circle");

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

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    // console.log(offsetX, offsetY)
    setPrevPoint({
      x: offsetX,
      y: offsetY,
    });

    if (ctxRef.current && canvasRef.current) {
      snapshotRef.current = ctxRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
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
        ctx.putImageData(snapshotRef.current, 0 , 0);
      }
      circle(ctx, prevPoint,{
        x: offsetX,
        y: offsetY
      });
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

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
