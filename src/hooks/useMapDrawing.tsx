import { useState } from "react";
import type { AreaData, CircleData, Point } from "../types/mapArea";

interface UseMapDrawingProps {
  onAreaChange?: (areaData: AreaData | null) => void;
}

export const useMapDrawing = ({ onAreaChange }: UseMapDrawingProps) => {
  const [areaType, setAreaType] = useState<"circle" | "polygon" | null>(null);
  const [polygonPoints, setPolygonPoints] = useState<Point[]>([]);
  const [circleData, setCircleData] = useState<CircleData | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mapType, setMapType] = useState<"map" | "satellite">("map");
  const [mousePosition, setMousePosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleAreaTypeSelect = (type: "circle" | "polygon") => {
    if (areaType === type) {
      setAreaType(null);
      setPolygonPoints([]);
      setCircleData(null);
      setIsDrawing(false);
      onAreaChange?.(null);
    } else {
      setAreaType(type);
      setPolygonPoints([]);
      setCircleData(null);
      setIsDrawing(true);
    }
  };

  const handleMapClick = (latLng: { lat: number; lng: number }) => {
    console.log("handleMapClick called:", { latLng, isDrawing, areaType });

    if (!isDrawing || !areaType) {
      console.log("Not drawing or no area type selected");
      return;
    }

    if (areaType === "polygon") {
      const newPoint: Point = { lat: latLng.lat, lng: latLng.lng };
      const newPoints = [...polygonPoints, newPoint];
      console.log("Adding polygon point:", newPoint, "Total points:", newPoints.length);
      setPolygonPoints(newPoints);
      onAreaChange?.({ type: "polygon", points: newPoints });
    } else if (areaType === "circle") {
      if (!circleData) {
        // 원의 중심점 설정
        const center: Point = { lat: latLng.lat, lng: latLng.lng };
        console.log("Setting circle center:", center);
        setCircleData({ center, radius: 0 });
      } else {
        // 원의 반지름 계산
        const radius = calculateDistance(
          circleData.center.lat,
          circleData.center.lng,
          latLng.lat,
          latLng.lng,
        );
        const newCircleData = { ...circleData, radius };
        console.log("Setting circle radius:", radius, "Final circle:", newCircleData);
        setCircleData(newCircleData);
        setIsDrawing(false);
        onAreaChange?.({ type: "circle", data: newCircleData });
      }
    }
  };

  // 마우스 위치 추적
  const handleMapMouseMove = (latLng: { lat: number; lng: number }) => {
    if (!isDrawing || !areaType) return;
    setMousePosition({ lat: latLng.lat, lng: latLng.lng });
  };

  const handleMapMouseLeave = () => {
    setMousePosition(null);
  };

  const finishPolygon = () => {
    if (polygonPoints.length >= 3) {
      setIsDrawing(false);
      onAreaChange?.({ type: "polygon", points: polygonPoints });
    }
  };

  const clearArea = () => {
    setPolygonPoints([]);
    setCircleData(null);
    setIsDrawing(false);
    setAreaType(null);
    onAreaChange?.(null);
  };

  const handleMapTypeChange = (type: "map" | "satellite") => {
    setMapType(type);
  };

  // 픽셀 좌표계에서의 거리 계산
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number => {
    // 간단한 유클리드 거리 계산
    const deltaX = lng2 - lng1;
    const deltaY = lat2 - lat1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  };

  // 현재 마우스 위치에서의 임시 원 반지름 계산
  const getTemporaryCircleRadius = (): number => {
    if (!circleData || !mousePosition) return 0;
    return calculateDistance(
      circleData.center.lat,
      circleData.center.lng,
      mousePosition.lat,
      mousePosition.lng,
    );
  };

  // 계산된 값들
  const hasAreaData = polygonPoints.length > 0 || circleData;
  const canFinishPolygon =
    areaType === "polygon" && polygonPoints.length >= 3 && isDrawing;
  const temporaryCircleRadius = getTemporaryCircleRadius();

  return {
    // 상태
    areaType,
    polygonPoints,
    circleData,
    isDrawing,
    mapType,
    mousePosition,

    // 계산된 값
    hasAreaData,
    canFinishPolygon,
    temporaryCircleRadius,

    // 핸들러
    handleAreaTypeSelect,
    handleMapClick,
    handleMapMouseMove,
    handleMapMouseLeave,
    finishPolygon,
    clearArea,
    handleMapTypeChange,
  };
};
