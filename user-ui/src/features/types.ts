export type Point = {
  x: number;
  y: number;
};

export type Pencil = {
  id: string;
  type: "pencil";
  points: Point[];
  color: string;
  strokeWidth: number;
};

export type Brush = {
  id: string;
  type: "brush";
  points: Point[];
  color: string;
  strokeWidth: number;
};

export type Eraser = {
  id: string;
  type: "eraser";
  points: Point[];
  strokeWidth: number;
};

export type RoundedRectangle = {
  id: string;
  type: "rounded-rectangle";
  start: Point;
  end: Point;
  color: string;
  strokeWidth: number;
};

export type Rhombus = {
  id: string;
  type: "rhombus";
  start: Point;
  end: Point;
  color: string;
  strokeWidth: number;
};

export type Arrow = {
  id: string;
  type: "arrow";
  start: Point;
  end: Point;
  color: string;
  strokeWidth: number;
};

export type Rectangle = {
  id: string;
  type: "rectangle";
  start: Point;
  end: Point;
  color: string;
  strokeWidth: number;
};

export type Circle = {
  id: string;
  type: "circle";
  start: Point;
  end: Point;
  color: string;
  strokeWidth: number;
};

export type Line = {
  id: string;
  type: "line";
  start: Point;
  end: Point;
  color: string;
  strokeWidth: number;
};

export type TextShape = {
  id: string;
  type: "text";
  position: Point;
  text: string;
  color: string;
  fontSize: number;
};

export type Shape = Rectangle | Circle | Line | Pencil | Brush | Eraser | RoundedRectangle | Rhombus | Arrow | TextShape;

export type BoundingBox = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export type ResizeHandle = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";