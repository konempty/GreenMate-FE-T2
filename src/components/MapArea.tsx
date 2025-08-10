import React, { useState } from "react";
import { Circle, Pentagon } from "lucide-react";
import Button from "./Button";
import { Label } from "./label";
import { AreaData, PolygonPoint, CircleData } from "../types/mapArea";

import "../styles/MapArea.css";

interface MapAreaProps {
  className?: string;
  onAreaChange?: (areaData: AreaData) => void;
}

const MapArea: React.FC<MapAreaProps> = ({ className, onAreaChange }) => {
  // Area drawing states
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
    // 이미 선택된 타입을 다시 클릭하면 취소
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

  const hasAreaData = polygonPoints.length > 0 || circleData;
  const canFinishPolygon =
    areaType === "polygon" && polygonPoints.length >= 3 && isDrawing;

  return (
    <div className={`map-area ${className || ""}`}>
      <Label className="map-area-label">활동영역 *</Label>

      <div className="map-area-buttons">
        <Button
          type="button"
          className={`map-area-button ${areaType === "circle" ? "active" : ""}`}
          onClick={() => handleAreaTypeSelect("circle")}
        >
          <Circle size={18} />
          원형 영역
        </Button>
        <Button
          type="button"
          className={`map-area-button ${areaType === "polygon" ? "active" : ""}`}
          onClick={() => handleAreaTypeSelect("polygon")}
        >
          <Pentagon size={18} />
          다각형 영역
        </Button>
      </div>

      <div className="map-area-controls">
        {canFinishPolygon && (
          <Button
            type="button"
            onClick={finishPolygon}
            className="map-area-control-btn"
          >
            다각형 완성
          </Button>
        )}
        <Button
          type="button"
          onClick={clearArea}
          className={`map-area-control-btn ${hasAreaData ? "active" : "disabled"}`}
        >
          영역 지우기
        </Button>
      </div>

      <div className="map-container">
        <div
          className="interactive-map"
          onClick={handleMapClick}
          onMouseMove={handleMapMouseMove}
          onMouseLeave={handleMapMouseLeave}
          style={{ cursor: isDrawing ? "crosshair" : "default" }}
        >
          <div className="map-toggle-overlay">
            <Button
              type="button"
              className={`map-toggle ${mapType === "map" ? "active" : ""}`}
              onClick={() => handleMapTypeChange("map")}
            >
              Map
            </Button>
            <Button
              type="button"
              className={`map-toggle ${mapType === "satellite" ? "active" : ""}`}
              onClick={() => handleMapTypeChange("satellite")}
            >
              Satellite
            </Button>
          </div>
          <svg className="map-overlay">
            {areaType === "polygon" && polygonPoints.length > 0 && (
              <>
                <polygon
                  points={polygonPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="#C2DDF4"
                  stroke="#5997DA"
                  strokeWidth="2"
                />
                {polygonPoints.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#5997DA"
                  />
                ))}
              </>
            )}

            {areaType === "polygon" &&
              isDrawing &&
              polygonPoints.length > 0 &&
              mousePosition && (
                <>
                  <line
                    x1={polygonPoints[polygonPoints.length - 1].x}
                    y1={polygonPoints[polygonPoints.length - 1].y}
                    x2={mousePosition.x}
                    y2={mousePosition.y}
                    stroke="#5997DA"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                  {polygonPoints.length >= 2 && (
                    <line
                      x1={mousePosition.x}
                      y1={mousePosition.y}
                      x2={polygonPoints[0].x}
                      y2={polygonPoints[0].y}
                      stroke="#5997DA"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.5"
                    />
                  )}
                </>
              )}

            {areaType === "circle" && circleData && (
              <>
                <circle
                  cx={circleData.center.x}
                  cy={circleData.center.y}
                  r={circleData.radius}
                  fill="#C2DDF4"
                  stroke="#5997DA"
                  strokeWidth="2"
                />
                <circle
                  cx={circleData.center.x}
                  cy={circleData.center.y}
                  r="4"
                  fill="#5997DA"
                />
              </>
            )}

            {areaType === "circle" &&
              isDrawing &&
              circleData &&
              circleData.radius === 0 &&
              mousePosition && (
                <>
                  <circle
                    cx={circleData.center.x}
                    cy={circleData.center.y}
                    r={Math.sqrt(
                      Math.pow(mousePosition.x - circleData.center.x, 2) +
                        Math.pow(mousePosition.y - circleData.center.y, 2),
                    )}
                    fill="#C2DDF4"
                    stroke="#5997DA"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                  <line
                    x1={circleData.center.x}
                    y1={circleData.center.y}
                    x2={mousePosition.x}
                    y2={mousePosition.y}
                    stroke="#5997DA"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                    opacity="0.5"
                  />
                </>
              )}
          </svg>
          <p>구글 맵 API가 연결될 예정입니다.</p>
        </div>
      </div>
    </div>
  );
};

export default MapArea;
