import { LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/PageHeader";
import { useAdminAuth } from "../AdminAuthContext";

export default function Settings() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate("/");
  }

  return (
    <>
      <PageHeader
        eyebrow="PREFERENCES"
        title="Settings"
        description="Manage your administrator session."
      />

      <section className="admin-panel settings-card">
        <div className="settings-icon">
          <ShieldCheck size={24} />
        </div>

        <h3>Administrator session</h3>

        <p>
          You are signed in to the Junior Church administration
          workspace.
        </p>

        <button
          className="btn btn-danger"
          onClick={signOut}
        >
          <LogOut size={17} />
          Sign out
        </button>
      </section>
    </>
  );
}