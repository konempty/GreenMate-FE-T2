import React, { useEffect, useRef, useState } from "react";
import type { AreaData } from "../types/mapArea";
import GoogleMapsLoader from "../utils/GoogleMapsLoader";
import "../styles/MapArea.css";

interface MapAreaProps {
  areaData: AreaData;
  height?: number;
}

const MapArea: React.FC<MapAreaProps> = ({ areaData, height = 300 }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 도형의 중심점과 적절한 줌 레벨 계산
  const calculateMapConfig = (areaData: AreaData) => {
    if (areaData.type === "circle" && areaData.data) {
      const center = areaData.data.center;
      const radius = areaData.data.radius;

      // 원형 영역 줌 레벨 계산
      const radiusThresholds = [5000, 2000, 1000, 500, 200, 100, 50, 0];
      const radiusZooms = [10, 11, 12, 13, 14, 15, 16, 17];
      const zoom = radiusZooms[radiusThresholds.findIndex(threshold => radius >= threshold)];

      console.log("원형 영역:", { center, radius, zoom });
      return { center, zoom };
    } else if (areaData.type === "polygon" && areaData.points) {
      // 폴리곤 중심점 및 크기 계산
      const lats = areaData.points.map(p => p.lat);
      const lngs = areaData.points.map(p => p.lng);
      const center = {
        lat: lats.reduce((sum, lat) => sum + lat, 0) / lats.length,
        lng: lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length,
      };

      const maxSpan = Math.max(
        Math.max(...lats) - Math.min(...lats),
        Math.max(...lngs) - Math.min(...lngs),
      );

      // 폴리곤 영역 줌 레벨 계산
      const spanThresholds = [0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001, 0.0005, 0];
      const spanZooms = [9, 10, 11, 12, 13, 14, 15, 16, 17];
      const zoom = spanZooms[spanThresholds.findIndex(threshold => maxSpan >= threshold)];

      console.log("폴리곤 영역:", { center, maxSpan, zoom });
      return { center, zoom };
    }

    // 기본값 (서울 시청)
    return { center: { lat: 37.5665, lng: 126.978 }, zoom: 15 };
  };

  // Google Maps API 로드
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        console.log("Google Maps 로드 시작...");
        setError(null);
        const loader = GoogleMapsLoader.getInstance();
        await loader.load();
        console.log("Google Maps 로드 완료");
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

  // 지도 초기화 및 도형 그리기
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    try {
      console.log("지도 초기화 시작...");
      
      // 계산된 중심점과 줌 레벨
      const mapConfig = calculateMapConfig(areaData);

      // 지도 생성
      const map = new google.maps.Map(mapRef.current, {
        zoom: mapConfig.zoom,
        center: mapConfig.center,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
      });

      mapInstanceRef.current = map;
      console.log("지도 생성 완료", mapConfig);

      // 도형 그리기
      if (areaData.type === "circle" && areaData.data) {
        // 원 그리기
        new google.maps.Circle({
          strokeColor: "#4a90e2",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "rgba(74, 144, 226, 0.3)",
          fillOpacity: 0.5,
          map: map,
          center: areaData.data.center,
          radius: areaData.data.radius,
        });

        // 원의 경계에 맞게 지도 조정 (더 정확한 피팅)
        const bounds = new google.maps.LatLngBounds();
        const center = areaData.data.center;
        const radius = areaData.data.radius;
        
        // 원의 대략적인 경계 계산 (위도/경도 변환)
        const latOffset = radius / 111320; // 1도 ≈ 111.32km
        const lngOffset = radius / (111320 * Math.cos(center.lat * Math.PI / 180));
        
        bounds.extend({ lat: center.lat + latOffset, lng: center.lng + lngOffset });
        bounds.extend({ lat: center.lat - latOffset, lng: center.lng - lngOffset });
        bounds.extend({ lat: center.lat + latOffset, lng: center.lng - lngOffset });
        bounds.extend({ lat: center.lat - latOffset, lng: center.lng + lngOffset });
        
        // 약간의 패딩을 주어 여유 공간 확보
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });

        console.log("원 그리기 완료:", {
          center: areaData.data.center,
          radius: areaData.data.radius,
        });
      } 
      else if (areaData.type === "polygon" && areaData.points) {
        // 폴리곤 그리기
        new google.maps.Polygon({
          paths: areaData.points,
          strokeColor: "#4a90e2",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "rgba(74, 144, 226, 0.3)",
          fillOpacity: 0.5,
          map: map,
        });

        // 폴리곤의 경계에 맞게 지도 조정
        const bounds = new google.maps.LatLngBounds();
        areaData.points.forEach(point => {
          bounds.extend({ lat: point.lat, lng: point.lng });
        });
        
        // 약간의 패딩을 주어 여유 공간 확보
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });

        console.log("폴리곤 그리기 완료:", {
          points: areaData.points.length,
          coords: areaData.points,
        });
      }

      // 지도 클릭 이벤트 (좌표 확인용)
      map.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          console.log("지도 클릭 좌표:", { lat, lng });
        }
      });
    } catch (err) {
      console.error("지도 초기화 오류:", err);
      setError("지도를 초기화할 수 없습니다.");
    }
  }, [
    isLoaded,
    areaData,
  ]); // 의존성을 간단히 areaData 전체로 변경

  // 지도 렌더링
  return (
    <div className="map-area-container">
      {error && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(255, 0, 0, 0.9)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          {error}
        </div>
      )}
      <div
        ref={mapRef}
        className="map-area-map"
        style={{
          height: `${height}px`,
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />
    </div>
  );
};

export default MapArea;
