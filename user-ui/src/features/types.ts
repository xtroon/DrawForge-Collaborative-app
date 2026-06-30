export type Point = {
  x: number;
  y: number;
};

export type Rectangle = {
  type: "rectangle";
  start: Point;
  end: Point;
};

export type Pencil = {
  type: "pencil";
  points: Point[];
};

export type Shape = Rectangle | Pencil;