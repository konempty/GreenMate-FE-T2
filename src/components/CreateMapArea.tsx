import React from "react";
import { Circle, Pentagon } from "lucide-react";
import Button from "./Button";
import { Label } from "./label";
import type { AreaData } from "../types/mapArea";
import { useMapDrawing } from "../hooks/useMapDrawing";

import "../styles/CreateMapArea.css";

interface MapAreaProps {
  className?: string;
  onAreaChange?: (areaData: AreaData | null) => void;
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

  // 안전한 클릭 핸들러
  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 임시로 x,y 좌표를 lat,lng로 변환 (나중에 실제 Google Maps로 교체)
    handleMapClick({ lat: y, lng: x });
  };

  // 안전한 마우스 이동 핸들러
  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 임시로 x,y 좌표를 lat,lng로 변환 (나중에 실제 Google Maps로 교체)
    handleMapMouseMove({ lat: y, lng: x });
  };

  // 마지막 점의 안전한 접근
  const getLastPoint = () => {
    if (polygonPoints.length === 0) return null;
    return polygonPoints[polygonPoints.length - 1];
  };

  const lastPoint = getLastPoint();

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
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
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
            {/* 폴리곤 표시 */}
            {areaType === "polygon" && polygonPoints.length > 0 && (
              <>
                <polygon
                  points={polygonPoints.map((p) => `${p.lng},${p.lat}`).join(" ")}
                  fill="#C2DDF4"
                  stroke="#5997DA"
                  strokeWidth="2"
                />
                {polygonPoints.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.lng}
                    cy={point.lat}
                    r="4"
                    fill="#5997DA"
                  />
                ))}
              </>
            )}

            {/* 폴리곤 그리기 중 임시 선 */}
            {areaType === "polygon" &&
              isDrawing &&
              polygonPoints.length > 0 &&
              mousePosition &&
              lastPoint && (
                <>
                  <line
                    x1={lastPoint.lng}
                    y1={lastPoint.lat}
                    x2={mousePosition.lng}
                    y2={mousePosition.lat}
                    stroke="#5997DA"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                  {polygonPoints.length >= 2 && (
                    <line
                      x1={mousePosition.lng}
                      y1={mousePosition.lat}
                      x2={polygonPoints[0]?.lng || 0}
                      y2={polygonPoints[0]?.lat || 0}
                      stroke="#5997DA"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.5"
                    />
                  )}
                </>
              )}

            {/* 원 표시 */}
            {areaType === "circle" && circleData && (
              <>
                <circle
                  cx={circleData.center.lng}
                  cy={circleData.center.lat}
                  r={circleData.radius}
                  fill="#C2DDF4"
                  stroke="#5997DA"
                  strokeWidth="2"
                />
              </>
            )}

            {/* 원 그리기 중 임시 원 */}
            {areaType === "circle" &&
              isDrawing &&
              circleData &&
              circleData.radius === 0 &&
              mousePosition && (
                <>
                  <circle
                    cx={circleData.center.lng}
                    cy={circleData.center.lat}
                    r={Math.sqrt(
                      Math.pow(mousePosition.lng - circleData.center.lng, 2) +
                        Math.pow(mousePosition.lat - circleData.center.lat, 2),
                    )}
                    fill="#C2DDF4"
                    stroke="#5997DA"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                </>
              )}
          </svg>

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "#666",
              fontSize: "14px",
              pointerEvents: "none",
            }}
          >
            <p>구글 맵 API가 연결될 예정입니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMapArea;
