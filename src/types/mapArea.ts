export interface Point {
  lat: number; // x -> lat로 변경
  lng: number; // y -> lng로 변경
}

export interface CircleData {
  center: Point;
  radius: number; // 미터 단위
}

export interface AreaData {
  type: "circle" | "polygon";
  data?: CircleData;
  points?: Point[];
}
