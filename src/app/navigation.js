import {
  Home,
  Users,
  Award,
  CircleDot,
  Images,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export const publicNavigation = [
  { label: "Home", path: "/", icon: Home },
  { label: "Members", path: "/members", icon: Users },
  { label: "Exco", path: "/exco", icon: Award },
  { label: "Status", path: "/status", icon: CircleDot },
  { label: "Throwbacks", path: "/throwbacks", icon: Images },
];

export const adminNavigation = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Members", path: "/admin/members", icon: Users },
  { label: "Exco", path: "/admin/exco", icon: Award },
  { label: "Status", path: "/admin/status", icon: CircleDot },
  { label: "Throwbacks", path: "/admin/throwbacks", icon: Images },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];