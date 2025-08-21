import React, { useEffect, useRef, useState } from "react";
import type { AreaData } from "../types/mapArea";
import GoogleMapsLoader from "../utils/GoogleMapsLoader";
import "../styles/MapArea.css";

interface MapAreaProps {
  areaData?: AreaData;
  height?: number;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const MapArea = ({
  areaData,
  height = 300,
  center = { lat: 37.5665, lng: 126.978 }, // 서울 시청 기본값
  zoom = 13,
}: MapAreaProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const overlaysRef = useRef<(google.maps.Polygon | google.maps.Circle)[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google Maps API 로드
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        setError(null);
        const loader = GoogleMapsLoader.getInstance();
        await loader.load();
        setIsLoaded(true);
      } catch (err) {
        console.error("Google Maps 로드 오류:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Google Maps API 로드에 실패했습니다.",
        );
      }
    };

    void loadGoogleMaps();
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    try {
      const map = new google.maps.Map(mapRef.current, {
        zoom,
        center,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
      });

      mapInstanceRef.current = map;
    } catch (err) {
      console.error("지도 초기화 오류:", err);
      setError("지도를 초기화할 수 없습니다.");
    }
  }, [isLoaded, center, zoom]);

  // 활동 영역 표시
  useEffect(() => {
    if (!mapInstanceRef.current || !areaData) return;

    // 기존 오버레이 제거
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    try {
      if (areaData.type === "circle" && areaData.data) {
        const circle = new google.maps.Circle({
          strokeColor: "#4a90e2",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#4a90e2",
          fillOpacity: 0.3,
          map: mapInstanceRef.current,
          center: {
            lat: areaData.data.center.lat,
            lng: areaData.data.center.lng,
          },
          radius: areaData.data.radius, // 미터 단위
        });

        overlaysRef.current.push(circle);

        // 지도 중심을 원의 중심으로 이동
        mapInstanceRef.current.setCenter({
          lat: areaData.data.center.lat,
          lng: areaData.data.center.lng,
        });
      } else if (areaData.type === "polygon" && areaData.points) {
        const polygon = new google.maps.Polygon({
          paths: areaData.points.map((point) => ({
            lat: point.lat,
            lng: point.lng,
          })),
          strokeColor: "#4a90e2",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#4a90e2",
          fillOpacity: 0.3,
        });

        polygon.setMap(mapInstanceRef.current);
        overlaysRef.current.push(polygon);

        // 폴리곤의 경계에 맞게 지도 조정
        const bounds = new google.maps.LatLngBounds();
        areaData.points.forEach((point) => {
          bounds.extend({ lat: point.lat, lng: point.lng });
        });
        mapInstanceRef.current.fitBounds(bounds);
      }
    } catch (err) {
      console.error("활동 영역 표시 오류:", err);
    }
  }, [areaData]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    };
  }, []);

  if (error) {
    return (
      <div className="map-area-container">
        <div className="map-area-error" style={{ height: `${height}px` }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-area-container">
        <div className="map-area-loading" style={{ height: `${height}px` }}>
          <p>지도를 로드하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-area-container">
      <div
        ref={mapRef}
        className="map-area-map"
        style={{ height: `${height}px` }}
      />
      {!areaData && (
        <div className="map-area-no-data">
          <p>활동 영역이 설정되지 않았습니다.</p>
        </div>
      )}
    </div>
  );
};

export default MapArea;
