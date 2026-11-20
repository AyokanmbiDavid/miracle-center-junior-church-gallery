import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Church,
  Menu,
  X,
  LogIn,
} from "lucide-react";

import {
  publicNavigation,
  adminNavigation,
} from "../app/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
  const navigation = isAdmin
    ? adminNavigation
    : publicNavigation;

  return (
    <>
      <button
        className="mobile-menu"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu />
      </button>

      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Church size={22} />
          </div>

          <div>
            <strong>Miracle Centre</strong>
            <small>Junior Church Gallery</small>
          </div>

          <button
            className="sidebar-close"
            onClick={() => setOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="sidebar-label">
          {isAdmin ? "ADMINISTRATION" : "EXPLORE"}
        </div>

        <nav className="sidebar-nav">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/" || path === "/admin"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {!isAdmin && (
            <NavLink
              to="/admin/login"
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              <LogIn size={18} />
              Admin access
            </NavLink>
          )}

          <div className="sidebar-caption">
            Pacesetters Centre
            <br />
            Growing together in faith.
          </div>
        </div>
      </aside>
    </>
  );
}