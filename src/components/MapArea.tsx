import React, { useEffect, useRef } from "react";
import type { AreaData } from "../types/mapArea";
import { useGoogleMapsLoader } from "../hooks/useGoogleMapsLoader";
import GoogleMapsLoadingSpinner from "../utils/GoogleMapsLoadingSpinner";
import GoogleMapsError from "../utils/GoogleMapsError";
import "../styles/MapArea.css";

interface MapAreaProps {
  areaData: AreaData;
  height?: number;
}

const MapArea: React.FC<MapAreaProps> = ({ areaData, height = 300 }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const { isLoaded, isLoading, error, loadProgress } = useGoogleMapsLoader();

  // 도형의 중심점과 적절한 줌 레벨 계산
  const calculateMapConfig = (areaData: AreaData) => {
    if (areaData.type === "circle" && areaData.data) {
      const center = areaData.data.center;
      const radius = areaData.data.radius;

      // 수정된 원형 영역 줌 계산
      const radiusThresholds = [500, 400, 350, 300, 250, 200, 150, 100, 50, 0];
      const radiusZooms = [15, 15, 16, 16, 16, 16, 16, 17, 18, 19];

      // findIndex가 -1을 반환하는 경우 처리
      const zoomIndex = radiusThresholds.findIndex(
        (threshold) => radius >= threshold,
      );
      const zoom = zoomIndex !== -1 ? radiusZooms[zoomIndex] : 19; // 기본값 19

      console.log("원형 영역 줌 계산:", {
        center,
        radius,
        zoomIndex,
        zoom,
        radiusThresholds,
        radiusZooms,
      });
      return { center, zoom };
    } else if (
      areaData.type === "polygon" &&
      areaData.points &&
      areaData.points.length > 0
    ) {
      const lats = areaData.points.map((p) => p.lat);
      const lngs = areaData.points.map((p) => p.lng);
      const center = {
        lat: lats.reduce((sum, lat) => sum + lat, 0) / lats.length,
        lng: lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length,
      };

      const maxSpan = Math.max(
        Math.max(...lats) - Math.min(...lats),
        Math.max(...lngs) - Math.min(...lngs),
      );

      // 폴리곤 영역 줌 계산
      const spanThresholds = [
        0.01, 0.005, 0.003, 0.002, 0.001, 0.0005, 0.0002, 0.0001, 0,
      ];
      const spanZooms = [14, 15, 16, 18, 19, 20, 21, 22, 23];

      const zoomIndex = spanThresholds.findIndex(
        (threshold) => maxSpan >= threshold,
      );
      const zoom = zoomIndex !== -1 ? spanZooms[zoomIndex] : 20; // 기본값 20

      console.log("폴리곤 영역 줌 계산:", {
        center,
        maxSpan,
        zoomIndex,
        zoom,
        spanThresholds,
        spanZooms,
      });
      return { center, zoom };
    }

    console.log("기본 설정 사용");
    return { center: { lat: 37.5665, lng: 126.978 }, zoom: 15 };
  };

  // 지도 초기화 및 도형 그리기
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    try {
      console.log("지도 초기화 시작...");

      const mapConfig = calculateMapConfig(areaData);
      console.log("계산된 지도 설정:", mapConfig);

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
        maxZoom: 20,
        minZoom: 8,
      });

      mapInstanceRef.current = map;
      console.log("지도 생성 완료, 현재 줌:", map.getZoom());

      // 지도 로드 완료 후 줌 확인
      google.maps.event.addListenerOnce(map, "idle", () => {
        console.log("지도 로드 완료, 최종 줌:", map.getZoom());
      });

      // 도형 그리기
      if (areaData.type === "circle" && areaData.data) {
        console.log("원 그리기 시작:", areaData.data);

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

        // 원의 경계에 맞게 지도 조정하지만 초기 줌 레벨 유지
        setTimeout(() => {
          const bounds = new google.maps.LatLngBounds();
          const center = areaData.data.center;
          const radius = areaData.data.radius;

          // 원의 대략적인 경계 계산
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

          // fitBounds 대신 center만 조정하고 줌은 유지
          map.setCenter(center);

          console.log("원 그리기 완료, 줌 유지:", {
            center: areaData.data.center,
            radius: areaData.data.radius,
            currentZoom: map.getZoom(),
          });
        }, 100);
      } else if (areaData.type === "polygon" && areaData.points) {
        console.log("폴리곤 그리기 시작:", areaData.points);

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

        // 폴리곤의 중심으로 이동하지만 줌은 유지
        setTimeout(() => {
          const lats = areaData.points.map((p) => p.lat);
          const lngs = areaData.points.map((p) => p.lng);
          const center = {
            lat: lats.reduce((sum, lat) => sum + lat, 0) / lats.length,
            lng: lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length,
          };

          map.setCenter(center);

          console.log("폴리곤 그리기 완료, 줌 유지:", {
            points: areaData.points.length,
            center: center,
            currentZoom: map.getZoom(),
          });
        }, 100);
      }

      // 지도 클릭 이벤트 (좌표 확인용)
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
  }, [isLoaded, areaData]);

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
