import { NavLink } from "react-router-dom";
import { Users, MessageSquare, Recycle } from "lucide-react";

import "../styles/PageNavigation.css";

const navItems = [
  { to: "/post", Icon: Users, text: "팀 모집" },
  { to: "/community", Icon: MessageSquare, text: "커뮤니티" },
  { to: "/recycling-education", Icon: Recycle, text: "분리수거 학습" },
];

export const PageNavigation = () => {
  return (
    <nav className="page-nav">
      {navItems.map(({ to, Icon, text }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `page-nav-button ${isActive ? "active" : ""}`
          }
        >
          <Icon size={20} className="page-nav-icon" />
          <span className="page-nav-text">{text}</span>
        </NavLink>
      ))}
    </nav>
  );
};
