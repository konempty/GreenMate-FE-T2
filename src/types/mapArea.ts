export interface PolygonPoint {
  x: number;
  y: number;
}

export interface CircleData {
  center: { x: number; y: number };
  radius: number;
}

export interface PolygonAreaData {
  type: "polygon";
  points: PolygonPoint[];
}

export interface CircleAreaData {
  type: "circle";
  data: CircleData;
}

export type AreaData = PolygonAreaData | CircleAreaData | null;
