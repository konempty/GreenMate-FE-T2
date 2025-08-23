export interface Point {
  lat: number;
  lng: number;
}

export interface CircleData {
  center: Point;
  radius: number; // 미터 단위
}

// 새로운 AreaData 구조
export interface AreaData {
  data?: CircleData;
  points?: Point[];
}

export type LocationType = "CIRCLE" | "POLYGON";
