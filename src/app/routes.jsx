
import { lazy, Suspense } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "./AppLayout";
import LoadingScreen from "../components/LoadingScreen";

// Public pages
const Home = lazy(() => import("../user/pages/Home"));
const General = lazy(() => import("../user/pages/General"));
const Exco = lazy(() => import("../user/pages/Exco"));
const Status = lazy(() => import("../user/pages/Status"));
const Throwbacks = lazy(() => import("../user/pages/Throwbacks"));

// Admin pages
const AdminLayout = lazy(() => import("../admin/AdminLayout"));
const AdminPage = lazy(() => import("../admin/pages/AdminPage"));
const Members = lazy(() => import("../admin/pages/Members"));
const AdminExco = lazy(() => import("../admin/pages/Exco"));
const AdminStatus = lazy(() => import("../admin/pages/Status"));
const AdminThrowbacks = lazy(() => import("../admin/pages/Throwbacks"));
const Settings = lazy(() => import("../admin/pages/Settings"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="members" element={<General />} />
          <Route path="exco" element={<Exco />} />
          <Route path="status" element={<Status />} />
          <Route path="throwbacks" element={<Throwbacks />} />

          <Route path="admin/login" element={<AdminPage />} />

          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminPage />} />
            <Route path="members" element={<Members />} />
            <Route path="exco" element={<AdminExco />} />
            <Route path="status" element={<AdminStatus />} />
            <Route path="throwbacks" element={<AdminThrowbacks />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
