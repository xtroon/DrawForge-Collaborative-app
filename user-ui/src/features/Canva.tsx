import { useEffect, useRef, useState } from "react";
import { pencil, rectangle, circle, line, roundedRectangle, rhombus, arrow, redrawCanvas } from "./draw";
import { isShapeHit, getBoundingBox, getHandleHit, translateShape, resizeShape } from "./utils";
import type { Shape, Point } from "./types";

type CanvasProps = {
  tool: "pointer" | "pencil" | "brush" | "eraser" | "rectangle" | "circle" | "line" | "rounded-rectangle" | "rhombus" | "arrow" | "text";
  zoom: number;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  color: string;
  strokeWidth: number;
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  commitShapes?: (shapes: Shape[]) => void;
  onCursorMove?: (x: number, y: number) => void;
};

export default function Canvas({ tool, zoom, pan, setPan, color, strokeWidth, shapes, setShapes, commitShapes, onCursorMove }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentPathRef = useRef<Point[]>([]);

  const [drawing, setDrawing] = useState(false);
  const [prevPoint, setPrevPoint] = useState({ x: 0, y: 0 });
  const [dragStartPoint, setDragStartPoint] = useState({ x: 0, y: 0 });
  const [textInput, setTextInput] = useState<{ x: number, y: number, worldX: number, worldY: number } | null>(null);
  
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [interactionMode, setInteractionMode] = useState<"panning" | "moving" | "resizing" | null>(null);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  
  const erasedShapesRef = useRef<Set<string>>(new Set());
  const hasErasedRef = useRef(false);

  const getRenderShapes = () => shapes.map(s => 
    erasedShapesRef.current.has(s.id) ? { ...s, color: "#FFFDF6" } : s
  );

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

      redrawCanvas(ctx, canvas, getRenderShapes(), pan, zoom, selectedShapeId);
    };

    // Initial setup
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [shapes, pan, zoom, selectedShapeId]);

  useEffect(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    if (!ctx || !canvas) return;

    redrawCanvas(ctx, canvas, getRenderShapes(), pan, zoom, selectedShapeId);
  }, [shapes, pan, zoom, selectedShapeId]);

  const getWorldCoordinates = (clientX: number, clientY: number) => {
    const scale = zoom / 100;
    return {
      x: (clientX - pan.x) / scale,
      y: (clientY - pan.y) / scale,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x: worldX, y: worldY } = getWorldCoordinates(e.clientX, e.clientY);
    
    if (tool === "pointer") {
      setDragStartPoint({ x: e.clientX, y: e.clientY });
      
      let mode: "panning" | "moving" | "resizing" = "panning";
      
      if (selectedShapeId) {
        const selectedShape = shapes.find(s => s.id === selectedShapeId);
        if (selectedShape) {
            const bb = getBoundingBox(selectedShape);
            const handle = getHandleHit(bb, worldX, worldY, zoom);
            if (handle) {
                mode = "resizing";
                setActiveHandle(handle);
                setInteractionMode(mode);
                setDrawing(true);
                return;
            }
        }
      }

      let hitShapeId: string | null = null;
      for (let i = shapes.length - 1; i >= 0; i--) {
          if (isShapeHit(shapes[i], worldX, worldY, 15)) {
              hitShapeId = shapes[i].id;
              break;
          }
      }

      setSelectedShapeId(hitShapeId);
      if (hitShapeId) {
          mode = "moving";
      } else {
          mode = "panning";
      }

      setInteractionMode(mode);
      setDrawing(true);
      return;
    }

    setPrevPoint({ x: worldX, y: worldY });
    currentPathRef.current = [{ x: worldX, y: worldY }];

    setDrawing(true);
    
    if (tool === "text") {
      e.currentTarget.releasePointerCapture(e.pointerId);
      
      // If there's an active text input, clicking canvas will blur it. 
      // We wrap the new state update in setTimeout so the blur event (which sets to null) runs first.
      setTimeout(() => {
        setTextInput({ x: e.clientX, y: e.clientY, worldX, worldY });
      }, 10);
      setDrawing(false);
      return;
    }

    if (tool === "eraser") {
        erasedShapesRef.current.clear();
        hasErasedRef.current = false;
        
        for (let i = shapes.length - 1; i >= 0; i--) {
            if (isShapeHit(shapes[i], worldX, worldY, 15)) {
                erasedShapesRef.current.add(shapes[i].id);
                hasErasedRef.current = true;
                
                const ctx = ctxRef.current;
                const canvas = canvasRef.current;
                if (ctx && canvas) redrawCanvas(ctx, canvas, getRenderShapes(), pan, zoom, selectedShapeId);
                break; // erase top-most shape only on down
            }
        }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drawing) return;

    if (tool === "pointer") {
      const dxClient = e.clientX - dragStartPoint.x;
      const dyClient = e.clientY - dragStartPoint.y;
      
      if (interactionMode === "panning") {
          setPan((prev) => ({ x: prev.x + dxClient, y: prev.y + dyClient }));
          setDragStartPoint({ x: e.clientX, y: e.clientY });
      } else if (interactionMode === "moving" && selectedShapeId) {
          const scale = zoom / 100;
          const dxWorld = dxClient / scale;
          const dyWorld = dyClient / scale;
          
          setShapes(prev => prev.map(s => 
              s.id === selectedShapeId ? translateShape(s, dxWorld, dyWorld) : s
          ));
          setDragStartPoint({ x: e.clientX, y: e.clientY });
      } else if (interactionMode === "resizing" && selectedShapeId && activeHandle) {
          const scale = zoom / 100;
          const dxWorld = dxClient / scale;
          const dyWorld = dyClient / scale;
          
          setShapes(prev => prev.map(s => 
              s.id === selectedShapeId ? resizeShape(s, activeHandle, dxWorld, dyWorld) : s
          ));
          setDragStartPoint({ x: e.clientX, y: e.clientY });
      }
      return;
    }

    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const { x: worldX, y: worldY } = getWorldCoordinates(e.clientX, e.clientY);

    if (onCursorMove) {
      onCursorMove(worldX, worldY);
    }

    if (tool === "eraser") {
        let erasedAny = false;
        for (let i = shapes.length - 1; i >= 0; i--) {
            if (!erasedShapesRef.current.has(shapes[i].id) && isShapeHit(shapes[i], worldX, worldY, 15)) {
                erasedShapesRef.current.add(shapes[i].id);
                hasErasedRef.current = true;
                erasedAny = true;
                break; // erase one shape per tick for better feel, or let it erase multiple
            }
        }
        if (erasedAny) {
            redrawCanvas(ctx, canvas, getRenderShapes(), pan, zoom, selectedShapeId);
        }
        return;
    }

    if (tool === "pencil" || tool === "brush") {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      if (tool === "brush") {
        ctx.shadowBlur = strokeWidth * 1.5;
        ctx.shadowColor = color;
      }
      const scale = zoom / 100;
      ctx.setTransform(scale, 0, 0, scale, pan.x, pan.y);
      pencil(ctx, prevPoint, { x: worldX, y: worldY });
      ctx.restore();

      setPrevPoint({ x: worldX, y: worldY });
      currentPathRef.current.push({ x: worldX, y: worldY });
      return;
    }

    // For other shapes, clear and redraw everything, then draw temporary shape
    redrawCanvas(ctx, canvas, getRenderShapes(), pan, zoom, selectedShapeId);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
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
    if (tool === "rounded-rectangle") {
      roundedRectangle(ctx, prevPoint, { x: worldX, y: worldY });
    }
    if (tool === "rhombus") {
      rhombus(ctx, prevPoint, { x: worldX, y: worldY });
    }
    if (tool === "arrow") {
      arrow(ctx, prevPoint, { x: worldX, y: worldY });
    }
    
    ctx.restore();
  };

  const commitAndSet = (updater: (prev: Shape[]) => Shape[]) => {
      setShapes(prev => {
          const next = updater(prev);
          if (commitShapes) Promise.resolve().then(() => commitShapes(next));
          return next;
      });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (tool === "pointer") {
      if (drawing && (interactionMode === "moving" || interactionMode === "resizing")) {
          commitAndSet(prev => prev);
      }
      setDrawing(false);
      setInteractionMode(null);
      setActiveHandle(null);
      return;
    }

    // Only save shape if we were actually drawing one
    if (!drawing) return;

    if (tool === "eraser") {
        if (hasErasedRef.current) {
            const erasedIds = new Set(erasedShapesRef.current);
            commitAndSet((prev) => prev.filter(s => !erasedIds.has(s.id)));
        }
        erasedShapesRef.current.clear();
        hasErasedRef.current = false;
        setDrawing(false);
        return;
    }

    const { x: worldX, y: worldY } = getWorldCoordinates(e.clientX, e.clientY);

    if (tool === "rectangle") {
      commitAndSet((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "rectangle",
          start: prevPoint,
          end: { x: worldX, y: worldY },
          color,
          strokeWidth,
        },
      ]);
    }
    if (tool === "circle") {
      commitAndSet((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "circle",
          start: prevPoint,
          end: { x: worldX, y: worldY },
          color,
          strokeWidth,
        },
      ]);
    }
    if (tool === "line") {
      commitAndSet((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "line",
          start: prevPoint,
          end: { x: worldX, y: worldY },
          color,
          strokeWidth,
        },
      ]);
    }
    if (tool === "rounded-rectangle" || tool === "rhombus" || tool === "arrow") {
      commitAndSet((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: tool as any,
          start: prevPoint,
          end: { x: worldX, y: worldY },
          color,
          strokeWidth,
        },
      ]);
    }
    if (tool === "pencil" || tool === "brush") {
      commitAndSet((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: tool,
          points: currentPathRef.current,
          color,
          strokeWidth,
        },
      ]);
    }
    setDrawing(false);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 bg-transparent ${
        tool === "pointer"
          ? drawing ? "cursor-grabbing" : "cursor-grab"
          : "cursor-crosshair"
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      />
      {textInput && (
        <textarea
          autoFocus
          className="absolute bg-transparent border border-blue-400 outline-none p-1 resize-none overflow-hidden whitespace-pre z-50"
          style={{
            left: textInput.x,
            top: textInput.y,
            color: color,
            fontSize: `${24 * (zoom / 100)}px`,
            fontFamily: 'sans-serif',
            lineHeight: 1.2,
            minWidth: '50px',
            minHeight: `${24 * (zoom / 100) * 1.5}px`
          }}
          onBlur={(e) => {
            if (e.target.value.trim()) {
              const updater = (prev: Shape[]) => [...prev, {
                id: crypto.randomUUID(),
                type: 'text',
                position: { x: textInput.worldX, y: textInput.worldY },
                text: e.target.value,
                color,
                fontSize: 24,
                strokeWidth: 0
              } as any];
              setShapes(prev => {
                const next = updater(prev);
                if (commitShapes) Promise.resolve().then(() => commitShapes(next));
                return next;
              });
            }
            setTextInput(null);
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = target.scrollHeight + 'px';
            target.style.width = 'auto';
            target.style.width = target.scrollWidth + 'px';
          }}
        />
      )}
    </>
  );
}
