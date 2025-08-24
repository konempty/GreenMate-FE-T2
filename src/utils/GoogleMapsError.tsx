import React from "react";

interface GoogleMapsErrorProps {
  error: string;
  height?: number;
  onRetry?: () => void;
}

const GoogleMapsError: React.FC<GoogleMapsErrorProps> = ({
  error,
  height = 300,
  onRetry,
}) => {
  return (
    <div
      style={{
        height: `${height}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
        borderRadius: "8px",
        border: "1px solid #ef5350",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* 에러 아이콘 */}
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#f44336",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
          boxShadow: "0 4px 20px rgba(244, 67, 54, 0.3)",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>

      {/* 에러 메시지 */}
      <h3 style={{ color: "#d32f2f", marginBottom: "8px", fontSize: "18px" }}>
        지도 로드 실패
      </h3>
      <p style={{ color: "#666", marginBottom: "16px", lineHeight: "1.5" }}>
        {error}
      </p>

      {/* 재시도 버튼 */}
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: "#4285f4",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background 0.3s ease",
            boxShadow: "0 2px 8px rgba(66, 133, 244, 0.3)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#3367d6")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#4285f4")}
        >
          🔄 다시 시도
        </button>
      )}

      <p style={{ color: "#999", fontSize: "12px", marginTop: "12px" }}>
        API 키를 확인하고 페이지를 새로고침 해주세요.
      </p>
    </div>
  );
};

export default GoogleMapsError;
