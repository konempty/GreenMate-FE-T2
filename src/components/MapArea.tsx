import React, { useEffect, useRef } from "react";
import type { AreaData, LocationType } from "../types/mapArea";
import { useGoogleMapsLoader } from "../hooks/useGoogleMapsLoader";
import GoogleMapsLoadingSpinner from "../utils/GoogleMapsLoadingSpinner";
import GoogleMapsError from "../utils/GoogleMapsError";
import "../styles/MapArea.css";

interface MapAreaProps {
  areaData: AreaData;
  locationType: LocationType;
  height?: number;
}

const MapArea: React.FC<MapAreaProps> = ({
  areaData,
  locationType,
  height = 300,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const { isLoaded, isLoading, error, loadProgress } = useGoogleMapsLoader();

  // 지도 초기화 및 도형 그리기
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    try {
      console.log("지도 초기화 시작...", { locationType, areaData });

      // 기본 지도 생성 (초기 center와 zoom은 초기값)
      const map = new google.maps.Map(mapRef.current, {
        zoom: 15, // 초기 줌 레벨
        center: { lat: 37.5665, lng: 126.978 }, // 초기 중심점 (서울 시청)
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        maxZoom: 20,
        minZoom: 8,
      });

      mapInstanceRef.current = map;
      console.log("지도 생성 완료");

      // 도형 그리기 및 자동 뷰포트 설정
      if (locationType === "CIRCLE" && areaData.data) {
        console.log("원 그리기 시작:", areaData.data);

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

        // 원의 경계 계산
        const bounds = new google.maps.LatLngBounds();
        const center = areaData.data.center;
        const radius = areaData.data.radius;

        const latOffset = radius / 111320;
        const lngOffset =
          radius / (111320 * Math.cos((center.lat * Math.PI) / 180));

        bounds.extend({
          lat: center.lat + latOffset,
          lng: center.lng + lngOffset,
        });
        bounds.extend({
          lat: center.lat - latOffset,
          lng: center.lng - lngOffset,
        });

        map.fitBounds(bounds);
      } else if (
        locationType === "POLYGON" &&
        areaData.points &&
        areaData.points.length > 0
      ) {
        console.log("폴리곤 그리기 시작:", areaData.points);

        new google.maps.Polygon({
          paths: areaData.points,
          strokeColor: "#4a90e2",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "rgba(74, 144, 226, 0.3)",
          fillOpacity: 0.5,
          map: map,
        });

        // 폴리곤의 모든 점을 포함하는 bounds 생성
        const bounds = new google.maps.LatLngBounds();
        areaData.points.forEach((point) => {
          bounds.extend(new google.maps.LatLng(point.lat, point.lng));
        });

        map.fitBounds(bounds);
      }

      // 지도 로드 완료 후 최종 줌 레벨 확인
      google.maps.event.addListenerOnce(map, "idle", () => {
        console.log("지도 로드 완료, 최종 설정:", {
          center: map.getCenter()?.toJSON(),
          zoom: map.getZoom(),
        });
      });

      // 지도 클릭 이벤트
      map.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          console.log("지도 클릭 좌표:", { lat, lng, zoom: map.getZoom() });
        }
      });
    } catch (err) {
      console.error("지도 초기화 오류:", err);
    }
  }, [isLoaded, areaData, locationType]);

  // 로딩 상태 처리
  if (isLoading) {
    return <GoogleMapsLoadingSpinner progress={loadProgress} height={height} />;
  }

  // 에러 상태 처리
  if (error) {
    return <GoogleMapsError error={error} height={height} />;
  }

  // 지도 렌더링
  return (
    <div className="map-area-container">
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
