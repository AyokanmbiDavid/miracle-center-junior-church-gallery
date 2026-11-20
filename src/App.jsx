import AppRoutes from "./app/routes";
import { AdminAuthProvider } from "./admin/AdminAuthContext";

export default function App() {
  return (
    <AdminAuthProvider>
      <AppRoutes />
    </AdminAuthProvider>
  );
}