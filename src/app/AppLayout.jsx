import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-area">
        <Header />

        <div className="page-container">
          <Outlet />
        </div>

        <footer className="app-footer">
          Miracle Centre Junior Church
          <span>•</span>
          Growing together in faith
        </footer>
      </main>
    </div>
  );
}