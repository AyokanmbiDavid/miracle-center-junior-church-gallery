
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Church,
  Menu,
  X,
  LogIn,
  Sparkles,
  ChevronRight,
  Heart,
  ShieldCheck,
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

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="
          fixed left-4 top-4 z-40
          grid size-12 place-items-center
          rounded-full
          bg-[#e8f2ee] text-[#176d68]
          shadow-sm
          transition-all duration-200
          hover:bg-[#dcece6]
          active:scale-95
          lg:hidden
        "
      >
        <Menu size={23} />
      </button>

      {/* MOBILE SCRIM */}
      <div
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 z-40
          bg-[#10201c]/35
          backdrop-blur-[3px]
          transition-opacity duration-300
          lg:hidden
          ${open
            ? "visible opacity-100"
            : "invisible opacity-0"}
        `}
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh w-[290px] max-w-[88vw]
          flex-col
          overflow-y-auto
          border-r border-[#e7efeb]
          bg-[#f8faf8]
          px-4 py-5
          shadow-[12px_0_40px_rgba(25,55,45,0.08)]
          transition-transform duration-300 ease-out
          lg:sticky lg:top-0 lg:z-30
          lg:h-dvh lg:w-[270px] lg:max-w-none
          lg:translate-x-0 lg:shadow-none
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* BRAND */}
        <div className="
          relative mb-8 flex items-center gap-3
          rounded-[26px]
          bg-[#e7f2ed]
          p-4
        ">
          <div className="
            grid size-12 shrink-0 place-items-center
            rounded-[18px]
            bg-[#176d68]
            text-white
            shadow-md shadow-[#176d68]/20
          ">
            <Church size={25} strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="
              truncate
              font-['Plus_Jakarta_Sans',sans-serif]
              text-[15px] font-extrabold
              tracking-tight text-[#20302d]
            ">
              Miracle Centre
            </h2>

            <p className="
              mt-1 text-[10px]
              font-bold uppercase tracking-[1.7px]
              text-[#65827a]
            ">
              Junior Church
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="
              grid size-9 place-items-center
              rounded-full text-[#56716a]
              transition hover:bg-white/70
              lg:hidden
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* NAVIGATION HEADING */}
        <div className="
          mb-3 flex items-center justify-between
          px-3
        ">
          <span className="
            text-[10px] font-extrabold
            uppercase tracking-[1.8px]
            text-[#879992]
          ">
            {isAdmin ? "Workspace" : "Discover"}
          </span>

          <span className="
            rounded-full bg-[#e5efea]
            px-2.5 py-1
            text-[9px] font-bold
            text-[#648078]
          ">
            {navigation.length} PAGES
          </span>
        </div>

        {/* NAVIGATION ITEMS */}
        <nav className="flex flex-col gap-1.5">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/" || path === "/admin"}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `
                group relative flex min-h-[54px]
                items-center gap-3
                rounded-full px-3
                transition-all duration-200
                active:scale-[0.98]
                ${
                  isActive
                    ? "bg-[#cce9df] text-[#105c54]"
                    : "text-[#526a62] hover:bg-[#edf3ef]"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Icon container */}
                  <span className={`
                    grid size-10 shrink-0 place-items-center
                    rounded-full transition-colors
                    ${
                      isActive
                        ? "bg-[#b2ddcf] text-[#105c54]"
                        : "bg-transparent text-[#647d74] group-hover:bg-[#e1ece6]"
                    }
                  `}>
                    <Icon
                      size={21}
                      strokeWidth={isActive ? 2.4 : 1.9}
                    />
                  </span>

                  {/* Label */}
                  <span className={`
                    flex-1 text-[13px]
                    ${isActive ? "font-extrabold" : "font-semibold"}
                  `}>
                    {label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <span className="
                      grid size-6 place-items-center
                      rounded-full bg-[#176d68]
                      text-white
                    ">
                      <ChevronRight size={14} />
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* DIVIDER */}
        <div className="my-6 h-px bg-[#e4ece7]" />

        {/* ADMIN ACCESS */}
        {!isAdmin && (
          <NavLink
            to="/admin/login"
            onClick={() => setOpen(false)}
            className={({ isActive }) => `
              flex min-h-[52px] items-center gap-3
              rounded-full px-3
              transition-all duration-200
              ${
                isActive
                  ? "bg-[#dcece6] text-[#176d68]"
                  : "text-[#526a62] hover:bg-[#edf3ef]"
              }
            `}
          >
            <span className="
              grid size-10 place-items-center
              rounded-full bg-[#e8efeb]
            ">
              <LogIn size={20} />
            </span>

            <span className="flex-1 text-[13px] font-semibold">
              Admin access
            </span>

            <ChevronRight size={17} />
          </NavLink>
        )}

        {/* BOTTOM CONTENT */}
        <div className="mt-auto pt-8">

          {/* FAITH CARD */}
          <div className="
            relative overflow-hidden
            rounded-[28px]
            bg-gradient-to-br
            from-[#dcefe7] via-[#e8f3ed] to-[#d7ebe2]
            p-5
          ">
            {/* Decorative background */}
            <div className="
              pointer-events-none absolute
              -right-8 -top-8 size-32
              rounded-full bg-white/35 blur-2xl
            " />

            <div className="
              relative mb-4 grid size-10
              place-items-center rounded-2xl
              bg-white/80 text-[#176d68]
            ">
              <Sparkles size={21} />
            </div>

            <h3 className="
              relative
              font-['Plus_Jakarta_Sans',sans-serif]
              text-[15px] font-extrabold
              tracking-tight text-[#203b34]
            ">
              Growing together.
            </h3>

            <p className="
              relative mt-2
              text-[11px] leading-[1.8]
              text-[#58766c]
            ">
              Building a generation rooted in faith,
              love and purpose.
            </p>

            <div className="
              relative mt-5 flex items-center
              justify-between border-t
              border-[#176d68]/10 pt-3
            ">
              <span className="
                text-[9px] font-extrabold
                tracking-[1.5px] text-[#487268]
              ">
                PACESETTERS CENTRE
              </span>

              <Heart
                size={17}
                className="text-[#176d68]"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="
            mt-5 flex items-center gap-2.5
            px-2 pb-2
          ">
            <span className="
              grid size-8 place-items-center
              rounded-full bg-[#e5efea]
              text-[#176d68]
            ">
              <ShieldCheck size={16} />
            </span>

            <div className="min-w-0">
              <p className="
                truncate text-[10px]
                font-bold text-[#536b62]
              ">
                Miracle Centre Junior Church
              </p>

              <p className="
                mt-0.5 text-[9px]
                text-[#91a19a]
              ">
                Growing together in faith.
              </p>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}
