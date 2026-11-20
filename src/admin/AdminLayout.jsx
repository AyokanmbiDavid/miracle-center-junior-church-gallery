import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";

export default function AdminLayout() {
  const { authenticated } = useAdminAuth();

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <Outlet />
    </div>
  );
}