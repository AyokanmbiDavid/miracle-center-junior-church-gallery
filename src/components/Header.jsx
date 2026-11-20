
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Bell,
  ChevronRight,
  Church,
  CircleCheck,
  Sparkles,
} from "lucide-react";

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
  const isAdmin = location.pathname.startsWith("/admin");

  const section = isAdmin ? "ADMINISTRATION" : "OUR COMMUNITY";

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        sticky top-0 z-30
        flex min-h-[78px]
        items-center justify-between
        gap-3
        border-b border-[#E8EFEB]/90
        bg-[#F8FAF8]/90
        px-4 py-3
        backdrop-blur-2xl
        sm:px-6
        lg:px-8
      "
    >
      {/* PAGE INFORMATION */}
      <div className="min-w-0 flex-1 pl-14 lg:pl-0">
        {/* Breadcrumb */}
        <div className="mb-1.5 flex items-center gap-2">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#E4F2EF] text-[#176D68]">
            <Church size={13} strokeWidth={2.2} />
          </div>

          <span className="
            text-[9px] font-extrabold
            tracking-[0.13em]
            text-[#71847B]
            sm:text-[10px]
          ">
            MIRACLE CENTRE
          </span>

          <ChevronRight
            size={12}
            className="shrink-0 text-[#A3B1AA]"
          />

          <span className="
            truncate text-[9px] font-bold
            tracking-[0.12em]
            text-[#176D68]
            sm:text-[10px]
          ">
            {section}
          </span>
        </div>

        {/* Page title */}
        <div className="flex items-center gap-2">
          <h1 className="
            truncate
            font-['Plus_Jakarta_Sans',sans-serif]
            text-[19px] font-extrabold
            tracking-[-0.7px]
            text-[#20302D]
            sm:text-[23px]
          ">
            {title}
          </h1>

          {isAdmin && (
            <span className="
              hidden rounded-full
              bg-[#EAE7F7]
              px-2.5 py-1
              text-[9px] font-extrabold
              tracking-wide text-[#6552A0]
              sm:inline-flex
            ">
              ADMIN
            </span>
          )}
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Online status */}
        <div className="
          hidden items-center gap-2
          rounded-full
          border border-[#DCECE4]
          bg-[#EDF6F0]
          px-3.5 py-2.5
          sm:flex
        ">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#299B78] opacity-30" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[#299B78]" />
          </span>

          <span className="text-[10px] font-bold text-[#397565]">
            Gallery online
          </span>

          <CircleCheck
            size={14}
            className="text-[#21856E]"
          />
        </div>

        {/* Mobile status */}
        <div
          className="
            grid size-10 place-items-center
            rounded-full bg-[#E4F2EF]
            sm:hidden
          "
          title="Gallery online"
          aria-label="Gallery online"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#299B78] opacity-30" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[#299B78]" />
          </span>
        </div>

        {/* Notification button */}
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="
            relative grid size-10
            place-items-center
            rounded-full
            bg-[#EEF3F0]
            text-[#526B61]
            transition-all duration-200
            hover:bg-[#E2ECE6]
            hover:text-[#176D68]
            active:scale-90
            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-[#176D68]/15
          "
        >
          <Bell size={19} strokeWidth={1.9} />

          <span className="
            absolute right-[9px] top-[8px]
            size-2 rounded-full
            border-2 border-[#EEF3F0]
            bg-[#176D68]
          " />
        </button>

        {/* Brand avatar */}
        <motion.div
          whileHover={{ rotate: -8, scale: 1.06 }}
          className="
            relative grid size-10
            shrink-0 place-items-center
            overflow-hidden
            rounded-[15px]
            bg-[#DCECE5]
            text-[#176D68]
            ring-2 ring-white
            shadow-sm
          "
          title="Miracle Centre Junior Church"
        >
          <div className="absolute -right-2 -top-2 size-7 rounded-full bg-white/40" />
          <Church size={20} strokeWidth={2} />
        </motion.div>
      </div>
    </motion.header>
  );
}
