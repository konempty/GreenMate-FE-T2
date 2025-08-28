import { api } from "./client";

// GeoJSON Type
export interface Point {
  lat: number;
  lng: number;
}

export interface CircleGeoJSON {
  center: Point;
  radius: number; // 미터 단위
}

export interface PolygonGeoJSON {
  points: Point[];
}

export type GeoJSON = CircleGeoJSON | PolygonGeoJSON;

// Request Type
export interface GreenTeamPostCreateRequest {
  title: string;
  content: string;
  locationType: "CIRCLE" | "POLYGON";
  locationGeojson: GeoJSON;
  maxParticipants: number;
  eventDate: string;
  deadlineAt: string;
}

// Response Type
export interface IdResponse {
  id: number;
}

export async function createGreenTeamPost(
  data: GreenTeamPostCreateRequest,
  images?: File[],
): Promise<IdResponse> {
  const formData = new FormData();

  // JSON 데이터를 Blob으로 추가 (Content-Type: application/json)
  const jsonBlob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });
  formData.append("data", jsonBlob);

  // 이미지 파일들 추가 (있는 경우만)
  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const response = await api.post<IdResponse>("/v1/green-team-posts", formData);

  return response.data;
}
