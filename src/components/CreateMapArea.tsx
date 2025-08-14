import React from "react";
import { Circle, Pentagon } from "lucide-react";
import Button from "./Button";
import { Label } from "./label";
import type { AreaData } from "../types/mapArea";
import { useMapDrawing } from "../hooks/useMapDrawing";

import "../styles/CreateMapArea.css";

interface MapAreaProps {
  className?: string;
  onAreaChange?: (areaData: AreaData) => void;
}

const CreateMapArea: React.FC<MapAreaProps> = ({ className, onAreaChange }) => {
  const {
    areaType,
    polygonPoints,
    circleData,
    isDrawing,
    mapType,
    mousePosition,
    hasAreaData,
    canFinishPolygon,
    handleAreaTypeSelect,
    handleMapClick,
    handleMapMouseMove,
    handleMapMouseLeave,
    finishPolygon,
    clearArea,
    handleMapTypeChange,
  } = useMapDrawing({ onAreaChange });

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
          disabled={!hasAreaData}
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

export default CreateMapArea;
