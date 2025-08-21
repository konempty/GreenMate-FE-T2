import React, { useEffect, useRef, useState } from "react";
import { Circle, Pentagon } from "lucide-react";
import Button from "./Button";
import { Label } from "./label";
import type { AreaData } from "../types/mapArea";
import { useMapDrawing } from "../hooks/useMapDrawing";
import GoogleMapsLoader from "../utils/GoogleMapsLoader";

import "../styles/CreateMapArea.css";

interface MapAreaProps {
  className?: string;
  onAreaChange?: (areaData: AreaData) => void;
}

const CreateMapArea: React.FC<MapAreaProps> = ({ className, onAreaChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const overlaysRef = useRef<(google.maps.Polygon | google.maps.Circle)[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const {
    areaType,
    polygonPoints,
    circleData,
    isDrawing,
    mapType,
    mousePosition,
    hasAreaData,
    canFinishPolygon,
    temporaryCircleRadius,
    handleAreaTypeSelect,
    handleMapClick,
    handleMapMouseMove,
    handleMapMouseLeave,
    finishPolygon,
    clearArea,
    handleMapTypeChange,
  } = useMapDrawing({ onAreaChange });

  // Google Maps 로드
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        setMapError(null);
        const loader = GoogleMapsLoader.getInstance();
        await loader.load();
        setIsMapLoaded(true);
      } catch (err) {
        console.error('Google Maps 로드 오류:', err);
        setMapError(err instanceof Error ? err.message : 'Google Maps API 로드에 실패했습니다.');
      }
    };

    void loadGoogleMaps();
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    try {
      const map = new google.maps.Map(mapRef.current, {
        zoom: 13,
        center: { lat: 37.5665, lng: 126.9780 }, // 서울 시청
        mapTypeId: mapType === "satellite" ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy',
      });

      mapInstanceRef.current = map;

      // 지도 클릭 이벤트
      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          handleMapClick({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          });
        }
      });

      // 마우스 이동 이벤트
      map.addListener('mousemove', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          handleMapMouseMove({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          });
        }
      });

      // 마우스 아웃 이벤트
      map.addListener('mouseleave', () => {
        handleMapMouseLeave();
      });

    } catch (err) {
      console.error('지도 초기화 오류:', err);
      setMapError('지도를 초기화할 수 없습니다.');
    }
  }, [isMapLoaded, handleMapClick, handleMapMouseMove, handleMapMouseLeave]);

  // 지도 타입 변경
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    mapInstanceRef.current.setMapTypeId(
      mapType === "satellite" ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP
    );
  }, [mapType]);

  // 영역 표시
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 기존 오버레이 제거
    overlaysRef.current.forEach(overlay => overlay.setMap(null));
    overlaysRef.current = [];

    try {
      // 폴리곤 표시
      if (areaType === "polygon" && polygonPoints.length > 0) {
        const polygon = new google.maps.Polygon({
          paths: polygonPoints.map(point => ({
            lat: point.lat,
            lng: point.lng
          })),
          strokeColor: "#5997DA",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#C2DDF4",
          fillOpacity: 0.5,
          editable: false,
          draggable: false,
        });

        polygon.setMap(mapInstanceRef.current);
        overlaysRef.current.push(polygon);

        // 점들 표시
        polygonPoints.forEach((point, index) => {
          const marker = new google.maps.Marker({
            position: { lat: point.lat, lng: point.lng },
            map: mapInstanceRef.current!,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: "#5997DA",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#FFFFFF",
            },
            title: `점 ${index + 1}`,
          });
          overlaysRef.current.push(marker);
        });
      }

      // 원형 표시
      if (areaType === "circle" && circleData && circleData.radius > 0) {
        const circle = new google.maps.Circle({
          strokeColor: "#5997DA",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#C2DDF4",
          fillOpacity: 0.5,
          map: mapInstanceRef.current,
          center: {
            lat: circleData.center.lat,
            lng: circleData.center.lng
          },
          radius: circleData.radius,
          editable: false,
          draggable: false,
        });

        overlaysRef.current.push(circle);

        // 중심점 마커
        const centerMarker = new google.maps.Marker({
          position: { lat: circleData.center.lat, lng: circleData.center.lng },
          map: mapInstanceRef.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: "#5997DA",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
          },
          title: "원의 중심",
        });
        overlaysRef.current.push(centerMarker);
      }

      // 임시 원형 표시 (그리기 중)
      if (areaType === "circle" && isDrawing && circleData && circleData.radius === 0 && mousePosition && temporaryCircleRadius > 0) {
        const tempCircle = new google.maps.Circle({
          strokeColor: "#5997DA",
          strokeOpacity: 0.6,
          strokeWeight: 2,
          fillColor: "#C2DDF4",
          fillOpacity: 0.3,
          map: mapInstanceRef.current,
          center: {
            lat: circleData.center.lat,
            lng: circleData.center.lng
          },
          radius: temporaryCircleRadius,
          editable: false,
          draggable: false,
        });

        overlaysRef.current.push(tempCircle);
      }

    } catch (err) {
      console.error('영역 표시 오류:', err);
    }
  }, [areaType, polygonPoints, circleData, isDrawing, mousePosition, temporaryCircleRadius]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      overlaysRef.current.forEach(overlay => overlay.setMap(null));
    };
  }, []);

  if (mapError) {
    return (
      <div className={`map-area ${className || ""}`}>
        <Label className="map-area-label">활동영역 *</Label>
        <div className="map-area-error">
          <p>{mapError}</p>
        </div>
      </div>
    );
  }

  if (!isMapLoaded) {
    return (
      <div className={`map-area ${className || ""}`}>
        <Label className="map-area-label">활동영역 *</Label>
        <div className="map-area-loading">
          <p>지도를 로드하는 중...</p>
        </div>
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
        <div className="interactive-map">
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
          
          <div 
            ref={mapRef} 
            className="google-map" 
            style={{ 
              width: '100%', 
              height: '400px', 
              borderRadius: '8px',
              cursor: isDrawing ? 'crosshair' : 'default'
            }}
          />

          {isDrawing && (
            <div className="drawing-instructions">
              {areaType === "polygon" && (
                <p>지도를 클릭하여 점을 추가하세요. (최소 3개 점 필요)</p>
              )}
              {areaType === "circle" && !circleData && (
                <p>원의 중심점을 클릭하세요.</p>
              )}
              {areaType === "circle" && circleData && circleData.radius === 0 && (
                <p>원의 반지름을 설정하기 위해 다시 클릭하세요.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMapArea;
