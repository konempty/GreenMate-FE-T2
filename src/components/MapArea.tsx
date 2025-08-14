import type { AreaData } from "../types/mapArea";
import "../styles/MapArea.css";

interface MapAreaProps {
  areaData?: AreaData;
  height?: number;
}

const MapArea = ({ areaData, height = 300 }: MapAreaProps) => {
  if (!areaData) {
    return (
      <div className="map-area-container">
        <div className="map-area-placeholder">
          <p>활동 영역이 설정되지 않았습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-area-container">
      <svg className="map-area-svg" width="100%" height={height}>
        {/* 원형 영역 */}
        {areaData.type === "circle" && areaData.data && (
          <>
            <circle
              cx={areaData.data.center.x}
              cy={areaData.data.center.y}
              r={areaData.data.radius}
              fill="rgba(74, 144, 226, 0.3)"
              stroke="#4a90e2"
              strokeWidth="2"
            />
          </>
        )}

        {/* 다각형 영역 */}
        {areaData.type === "polygon" && areaData.points && (
          <>
            <polygon
              points={areaData.points
                .map((point) => `${point.x},${point.y}`)
                .join(" ")}
              fill="rgba(74, 144, 226, 0.3)"
              stroke="#4a90e2"
              strokeWidth="2"
            />
            {/* 꼭짓점들 */}
            {areaData.points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#4a90e2"
              />
            ))}
          </>
        )}
      </svg>
    </div>
  );
};

export default MapArea;
