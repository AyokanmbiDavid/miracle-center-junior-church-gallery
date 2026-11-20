import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

const titles = {
  "/": "Overview",
  "/members": "Members",
  "/exco": "Leadership",
  "/status": "Status updates",
  "/throwbacks": "Throwback gallery",
  "/admin": "Dashboard",
  "/admin/members": "Manage members",
  "/admin/exco": "Manage Exco",
  "/admin/status": "Manage status",
  "/admin/throwbacks": "Manage throwbacks",
  "/admin/settings": "Settings",
  "/admin/login": "Admin access",
};

export default function Header() {
  const location = useLocation();

  const title = titles[location.pathname] || "Gallery";

  return (
    <header className="top-header">
      <div>
        <span className="header-overline">
          MIRACLE CENTRE / JUNIOR CHURCH
        </span>
        <h2>{title}</h2>
      </div>

      <div className="header-right">
        <span className="online-indicator" />
        <span>Gallery online</span>
        <div className="header-icon">
          <Bell size={18} />
        </div>
      </div>
    </header>
  );
}