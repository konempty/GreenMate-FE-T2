import React, { useEffect, useRef, useState } from "react";
import { Circle, Pentagon } from "lucide-react";
import Button from "./Button";
import { Label } from "./label";
import type { AreaData, LocationType } from "../types/mapArea";
import { useGoogleMapsLoader } from "../hooks/useGoogleMapsLoader";
import GoogleMapsLoadingSpinner from "../utils/GoogleMapsLoadingSpinner";
import GoogleMapsError from "../utils/GoogleMapsError";
import "../styles/CreateMapArea.css";

interface MapAreaProps {
  className?: string;
  onAreaChange?: (
    areaData: AreaData | null,
    locationType: LocationType | null,
  ) => void;
}

const CreateMapArea: React.FC<MapAreaProps> = ({ className, onAreaChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null,
  );
  const currentShapeRef = useRef<
    google.maps.Circle | google.maps.Polygon | null
  >(null);

  const [areaType, setAreaType] = useState<"circle" | "polygon" | null>(null);
  const [mapType, setMapType] = useState<"map" | "satellite">("map");
  const [hasAreaData, setHasAreaData] = useState(false);

  const { isLoaded, isLoading, error, loadProgress } = useGoogleMapsLoader();

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    try {
      console.log("CreateMapArea 지도 초기화 시작...");

      // 서울 시청을 기본 중심으로 설정
      const map = new google.maps.Map(mapRef.current, {
        zoom: 13,
        center: { lat: 37.5665, lng: 126.978 },
        mapTypeId:
          mapType === "satellite"
            ? google.maps.MapTypeId.SATELLITE
            : google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
      });

      mapInstanceRef.current = map;

      // Drawing Manager 초기화
      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        circleOptions: {
          strokeColor: "#4a90e2",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#4a90e2",
          fillOpacity: 0.3,
          editable: true,
          draggable: true,
        },
        polygonOptions: {
          strokeColor: "#4a90e2",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#4a90e2",
          fillOpacity: 0.3,
          editable: true,
          draggable: true,
        },
      });

      drawingManager.setMap(map);
      drawingManagerRef.current = drawingManager;

      // 도형 완성 이벤트 리스너
      google.maps.event.addListener(
        drawingManager,
        "circlecomplete",
        (circle: google.maps.Circle) => {
          console.log("원 그리기 완료");
          handleShapeComplete(circle, "circle");
        },
      );

      google.maps.event.addListener(
        drawingManager,
        "polygoncomplete",
        (polygon: google.maps.Polygon) => {
          console.log("폴리곤 그리기 완료");
          handleShapeComplete(polygon, "polygon");
        },
      );

      console.log("CreateMapArea 지도 초기화 완료");
    } catch (err) {
      console.error("CreateMapArea 지도 초기화 오류:", err);
    }
  }, [isLoaded]);

  // 도형 완성 처리
  const handleShapeComplete = (
    shape: google.maps.Circle | google.maps.Polygon,
    type: "circle" | "polygon",
  ) => {
    // 기존 도형 제거
    if (currentShapeRef.current) {
      currentShapeRef.current.setMap(null);
    }

    currentShapeRef.current = shape;
    setHasAreaData(true);

    // 그리기 모드 해제
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
    setAreaType(null);

    // AreaData 생성 및 콜백 호출
    if (type === "circle" && shape instanceof google.maps.Circle) {
      const center = shape.getCenter();
      const radius = shape.getRadius();

      if (center) {
        const areaData: AreaData = {
          data: {
            center: {
              lat: center.lat(),
              lng: center.lng(),
            },
            radius: radius,
          },
        };

        console.log("원 데이터:", areaData);
        onAreaChange?.(areaData, "CIRCLE");

        // 편집 이벤트 리스너 추가
        google.maps.event.addListener(shape, "center_changed", () =>
          updateCircleData(shape),
        );
        google.maps.event.addListener(shape, "radius_changed", () =>
          updateCircleData(shape),
        );
      }
    } else if (type === "polygon" && shape instanceof google.maps.Polygon) {
      const path = shape.getPath();
      const points = [];

      for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i);
        points.push({
          lat: point.lat(),
          lng: point.lng(),
        });
      }

      const areaData: AreaData = {
        points: points,
      };

      console.log("폴리곤 데이터:", areaData);
      onAreaChange?.(areaData, "POLYGON");

      // 편집 이벤트 리스너 추가
      google.maps.event.addListener(path, "set_at", () =>
        updatePolygonData(shape),
      );
      google.maps.event.addListener(path, "insert_at", () =>
        updatePolygonData(shape),
      );
      google.maps.event.addListener(path, "remove_at", () =>
        updatePolygonData(shape),
      );
    }
  };

  // 원 데이터 업데이트
  const updateCircleData = (circle: google.maps.Circle) => {
    const center = circle.getCenter();
    const radius = circle.getRadius();

    if (center) {
      const areaData: AreaData = {
        data: {
          center: {
            lat: center.lat(),
            lng: center.lng(),
          },
          radius: radius,
        },
      };

      console.log("원 데이터 업데이트:", areaData);
      onAreaChange?.(areaData, "CIRCLE");
    }
  };

  // 폴리곤 데이터 업데이트
  const updatePolygonData = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath();
    const points = [];

    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      points.push({
        lat: point.lat(),
        lng: point.lng(),
      });
    }

    const areaData: AreaData = {
      points: points,
    };

    console.log("폴리곤 데이터 업데이트:", areaData);
    onAreaChange?.(areaData, "POLYGON");
  };

  // 영역 타입 선택
  const handleAreaTypeSelect = (type: "circle" | "polygon") => {
    if (!drawingManagerRef.current) return;

    if (areaType === type) {
      // 같은 타입을 다시 클릭하면 해제
      setAreaType(null);
      drawingManagerRef.current.setDrawingMode(null);
    } else {
      setAreaType(type);
      if (type === "circle") {
        drawingManagerRef.current.setDrawingMode(
          google.maps.drawing.OverlayType.CIRCLE,
        );
      } else {
        drawingManagerRef.current.setDrawingMode(
          google.maps.drawing.OverlayType.POLYGON,
        );
      }
    }
  };

  // 영역 지우기
  const clearArea = () => {
    if (currentShapeRef.current) {
      currentShapeRef.current.setMap(null);
      currentShapeRef.current = null;
    }

    setAreaType(null);
    setHasAreaData(false);

    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }

    onAreaChange?.(null, null);
    console.log("영역 지우기 완료");
  };

  // 지도 타입 변경
  const handleMapTypeChange = (type: "map" | "satellite") => {
    setMapType(type);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(
        type === "satellite"
          ? google.maps.MapTypeId.SATELLITE
          : google.maps.MapTypeId.ROADMAP,
      );
    }
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className={`map-area ${className || ""}`}>
        <Label className="map-area-label">활동영역 *</Label>
        <GoogleMapsLoadingSpinner progress={loadProgress} height={400} />
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className={`map-area ${className || ""}`}>
        <Label className="map-area-label">활동영역 *</Label>
        <GoogleMapsError error={error} height={400} />
      </div>
    );
  }

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
        <div className="interactive-map">
          {/* 지도 타입 토글 */}
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

          {/* 실제 Google Maps */}
          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: "400px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />

          {/* 상태 안내 */}
          {areaType && (
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                background: "rgba(255, 255, 255, 0.95)",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#4a90e2",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                zIndex: 1000,
              }}
            >
              {areaType === "circle"
                ? "🔵 지도를 클릭하고 드래그하여 원을 그리세요"
                : "🔷 지도를 클릭하여 다각형 점을 추가하세요"}
            </div>
          )}

          {hasAreaData && (
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(40, 167, 69, 0.95)",
                color: "white",
                padding: "6px 10px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                zIndex: 1000,
              }}
            >
              ✅ 영역 설정 완료
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMapArea;
