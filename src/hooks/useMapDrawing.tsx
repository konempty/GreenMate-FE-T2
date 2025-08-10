import { useState } from "react";
import type { AreaData, PolygonPoint, CircleData } from "../types/mapArea";

interface UseMapDrawingProps {
  onAreaChange?: (areaData: AreaData) => void;
}

export const useMapDrawing = ({ onAreaChange }: UseMapDrawingProps) => {
  const [areaType, setAreaType] = useState<"circle" | "polygon" | null>(null);
  const [polygonPoints, setPolygonPoints] = useState<PolygonPoint[]>([]);
  const [circleData, setCircleData] = useState<CircleData | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mapType, setMapType] = useState<"map" | "satellite">("map");
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
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

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !areaType) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (areaType === "polygon") {
      const newPoints = [...polygonPoints, { x, y }];
      setPolygonPoints(newPoints);
      onAreaChange?.({ type: "polygon", points: newPoints });
    } else if (areaType === "circle") {
      if (!circleData) {
        setCircleData({ center: { x, y }, radius: 0 });
      } else {
        const radius = Math.sqrt(
          Math.pow(x - circleData.center.x, 2) +
            Math.pow(y - circleData.center.y, 2),
        );
        const newCircleData = { ...circleData, radius };
        setCircleData(newCircleData);
        setIsDrawing(false);
        onAreaChange?.({ type: "circle", data: newCircleData });
      }
    }
  };

  const handleMapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !areaType) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
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

  // 계산된 값들
  const hasAreaData = polygonPoints.length > 0 || circleData;
  const canFinishPolygon =
    areaType === "polygon" && polygonPoints.length >= 3 && isDrawing;

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
