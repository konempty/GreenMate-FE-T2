import { Link, useLocation } from "react-router-dom";
import { Users, MessageSquare, Recycle } from "lucide-react";

import "../styles/PageNavigation.css";

export const PageNavigation = () => {
  const location = useLocation(); // 현재 경로 가져오기

  return (
    <div className="page-nav">
      <Link
        to="/post"
        className={`page-nav-button ${location.pathname === "/post" ? "active" : ""}`}
      >
        <Users size={20} className="page-nav-icon" />
        <text className="page-nav-text">팀 모집</text>
      </Link>
      <Link
        to="/community"
        className={`page-nav-button ${location.pathname === "/community" ? "active" : ""}`}
      >
        <MessageSquare size={20} className="page-nav-icon" />
        <text className="page-nav-text">커뮤니티</text>
      </Link>
      <Link
        to="/recycling-education"
        className={`page-nav-button ${location.pathname === "/recycling-education" ? "active" : ""}`}
      >
        <Recycle size={20} className="page-nav-icon" />
        <text className="page-nav-text">분리수거 학습</text>
      </Link>
    </div>
  );
};
