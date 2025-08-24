import React from "react";

interface GoogleMapsLoadingSpinnerProps {
  progress?: number;
  message?: string;
  height?: number;
}

const GoogleMapsLoadingSpinner: React.FC<GoogleMapsLoadingSpinnerProps> = ({
  progress = 0,
  message = "지도를 로드하는 중...",
  height = 300,
}) => {
  return (
    <div
      style={{
        height: `${height}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        borderRadius: "8px",
        border: "1px solid #e1e5e9",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 배경 애니메이션 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-opacity='0.1'%3E%3Cpolygon fill='%23000' points='36 34 27 14 17 34'/%3E%3C/g%3E%3C/svg%3E")`,
          animation: "float 6s ease-in-out infinite",
        }}
      />

      {/* 메인 로딩 컨텐츠 */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        {/* 지도 아이콘 */}
        <div
          style={{
            width: "60px",
            height: "60px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "linear-gradient(45deg, #4285f4, #34a853)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse 2s ease-in-out infinite",
            boxShadow: "0 4px 20px rgba(66, 133, 244, 0.3)",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              fill="white"
            />
          </svg>
        </div>

        {/* 진행률 바 */}
        <div
          style={{
            width: "200px",
            height: "4px",
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: "2px",
            margin: "0 auto 12px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #4285f4, #34a853)",
              borderRadius: "2px",
              transition: "width 0.3s ease",
              boxShadow: "0 0 10px rgba(66, 133, 244, 0.5)",
            }}
          />
        </div>

        {/* 로딩 메시지 */}
        <p
          style={{
            color: "#5f6368",
            fontSize: "16px",
            fontWeight: "500",
            margin: "0 0 8px",
            textShadow: "0 1px 2px rgba(255, 255, 255, 0.8)",
          }}
        >
          🗺️ {message}
        </p>

        {/* 진행률 퍼센트 */}
        <p
          style={{
            color: "#4285f4",
            fontSize: "14px",
            fontWeight: "600",
            margin: 0,
            opacity: 0.8,
          }}
        >
          {progress}%
        </p>

        {/* 로딩 점들 */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "4px",
            justifyContent: "center",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#4285f4",
                animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite both`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default GoogleMapsLoadingSpinner;
