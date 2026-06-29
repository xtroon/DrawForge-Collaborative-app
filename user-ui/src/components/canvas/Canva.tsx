import { useEffect, useRef, useState } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [drawing, setDrawing] = useState(false);
  const [prevPoint, setPrevPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
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
  }, []);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    setPrevPoint({
      x: offsetX,
      y: offsetY,
    });

    setDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;

    const ctx = ctxRef.current;
    if (!ctx) return;

    const { offsetX, offsetY } = e.nativeEvent;

    ctx.beginPath();
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    setPrevPoint({
      x: offsetX,
      y: offsetY,
    });
  };

  const handleMouseUp = (e) => {
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