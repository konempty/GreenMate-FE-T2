import React, { useEffect, useRef, useState } from "react";
import type { AreaData } from "../types/mapArea";
import GoogleMapsLoader from "../utils/GoogleMapsLoader";
import "../styles/MapArea.css";

interface MapAreaProps {
  areaData?: AreaData;
  height?: number;
}

const MapArea: React.FC<MapAreaProps> = ({ areaData, height = 300 }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // 서울 시청 좌표
      const seoulCityHall = { lat: 37.5665, lng: 126.978 };

      // 지도 생성
      const map = new google.maps.Map(mapRef.current, {
        zoom: 14,
        center: seoulCityHall,
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
      console.log("지도 생성 완료");

      // 도형 그리기
      if (areaData?.type === "circle") {
        // 원 그리기
        new google.maps.Circle({
          strokeColor: "#4a90e2",
          strokeOpacity: 0.8, // 테두리 투명도
          strokeWeight: 2, // 테두리 두께
          fillColor: "rgba(74, 144, 226, 0.3)",
          fillOpacity: 0.5, // 채우기 투명도
          map: map, // 지도에 연결
          center: areaData?.data?.center, // 원의 중심
          radius: areaData?.data?.radius, // 반지름 (미터 단위)
        });

        console.log("원 그리기 완료:", {
          center: areaData?.data?.center,
          radius: areaData?.data?.radius,
        });
      } else if (areaData?.type === "polygon"){
        // 사각형 그리기
        new google.maps.Polygon({
          paths: areaData?.points,
          strokeColor: "#4a90e2",
          strokeOpacity: 0.8, // 테두리 투명도
          strokeWeight: 2, // 테두리 두께
          fillColor: "rgba(74, 144, 226, 0.3)",
          fillOpacity: 0.5, // 채우기 투명도
          map: map, // 지도에 연결
        });

        console.log("사각형 그리기 완료:", {
          points: areaData?.points?.length,
          coords: areaData?.points,
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
  }, [isLoaded]);

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
