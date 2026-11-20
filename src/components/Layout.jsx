
import { useEffect, useState } from "react";
import {
  NavLink,
  Link,
  useLocation,
} from "react-router-dom";

import {
  Home,
  Users,
  Award,
  Images,
  Newspaper,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  ArrowUpRight,
} from "lucide-react";

const publicLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/members", label: "Members", icon: Users },
  { to: "/exco", label: "Leadership", icon: Award },
  { to: "/status", label: "Church Updates", icon: Newspaper },
  { to: "/throwbacks", label: "Throwbacks", icon: Images },
];

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/members", label: "Members", icon: Users },
  { to: "/admin/exco", label: "Leadership", icon: Award },
  { to: "/admin/status", label: "Updates", icon: Newspaper },
  { to: "/admin/throwbacks", label: "Throwbacks", icon: Images },
];

export default function Layout({ children, admin, logout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = admin ? adminLinks : publicLinks;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={`app-shell ${admin ? "admin-shell" : "public-shell"}`}>

      {/* Header */}
      <header className="topbar">

        <div className="topbar-inner">

          <button
            className="icon-button mobile-menu"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>

          {/* Brand */}
          <Link to="/" className="brand">
            <span className="brand-mark">
              <ShieldCheck size={23} strokeWidth={2.2} />
            </span>

            <span className="brand-copy">
              <strong>Miracle Centre</strong>
              <small>JUNIOR CHURCH</small>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/" || item.to === "/admin"}
                  className={({ isActive }) =>
                    isActive ? "nav-item active" : "nav-item"
                  }
                >
                  <Icon size={17} strokeWidth={2} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="top-actions">
            {admin ? (
              <button
                className="logout-button"
                onClick={logout}
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            ) : (
              <Link className="admin-link" to="/admin/login">
                <ShieldCheck size={16} />
                <span>Admin</span>
                <ArrowUpRight size={14} />
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* Mobile backdrop */}
      {open && (
        <button
          className="mobile-backdrop"
          onClick={() => setOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      {/* Mobile Navigation */}
      <aside className={`mobile-panel ${open ? "open" : ""}`}>

        <div className="mobile-panel-header">
          <div>
            <span className="mobile-panel-label">
              {admin ? "ADMINISTRATION" : "EXPLORE"}
            </span>
            <h3>Navigation</h3>
          </div>

          <button
            className="icon-button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mobile-nav">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/" || item.to === "/admin"}
                className={({ isActive }) =>
                  isActive ? "mobile-nav-item active" : "mobile-nav-item"
                }
              >
                <span className="mobile-nav-icon">
                  <Icon size={19} />
                </span>

                <span>{item.label}</span>

                <ArrowUpRight
                  size={15}
                  className="mobile-nav-arrow"
                />
              </NavLink>
            );
          })}
        </nav>

        {admin && (
          <button className="mobile-logout" onClick={logout}>
            <LogOut size={18} />
            Logout from admin
          </button>
        )}

        <div className="mobile-panel-footer">
          <ShieldCheck size={17} />
          <span>Miracle Centre Junior Church</span>
        </div>

      </aside>

      {/* Main Content */}
      <main className="main-content" key={location.pathname}>
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">

          <div className="footer-brand">
            <span className="footer-brand-icon">
              <ShieldCheck size={18} />
            </span>

            <div>
              <strong>Miracle Centre</strong>
              <small>Junior Church</small>
            </div>
          </div>

          <p>
            Growing together in faith, love and purpose.
          </p>

          <span className="footer-copyright">
            © {new Date().getFullYear()} Miracle Centre
          </span>

        </div>
      </footer>

    </div>
  );
}
