export type Point = {
  x: number;
  y: number;
};

export type Rectangle = {
  id: string;
  type: "rectangle";
  start: Point;
  end: Point;
};

export type Circle = {
  id: string;
  type: "circle";
  start: Point;
  end: Point;
};

export type Line = {
  id: string;
  type: "line";
  start: Point;
  end: Point;
};

export type Pencil = {
  id: string;
  type: "pencil";
  points: Point[];
};

export type Shape = Rectangle | Circle | Line | Pencil;