import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LockKeyhole, LogIn } from "lucide-react";

import PageHeader from "../../components/PageHeader";
import { useAdminAuth } from "../AdminAuthContext";

import { useGalleryData } from "../../hooks/useGalleryData";
import { getMembers } from "../../services/memberService";
import { getPositions } from "../../services/excoService";
import { getStatuses } from "../../services/statusService";
import { getThrowbacks } from "../../services/throwbackService";

export default function AdminPage() {
  const {
    authenticated,
    login,
  } = useAdminAuth();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (authenticated) {
    return <Dashboard />;
  }

  async function submit(event) {
    event.preventDefault();

    setBusy(true);
    setError("");

    try {
      await login(password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">
          <LockKeyhole size={25} />
        </div>

        <PageHeader
          eyebrow="ADMINISTRATOR"
          title="Welcome back"
          description="Sign in to manage the church gallery."
        />

        <form onSubmit={submit}>
          <label className="form-label">
            Admin password

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          {error && (
            <div className="form-error">{error}</div>
          )}

          <button
            className="btn btn-primary full-width"
            disabled={busy}
          >
            {busy ? "Verifying..." : "Sign in"}
            <LogIn size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const members = useGalleryData(getMembers);
  const positions = useGalleryData(getPositions);
  const statuses = useGalleryData(() => getStatuses(false), []);
  const throwbacks = useGalleryData(getThrowbacks);

  const stats = [
    ["Members", members.data.length],
    ["Exco positions", positions.data.length],
    ["Active updates", statuses.data.length],
    ["Throwbacks", throwbacks.data.length],
  ];

  return (
    <>
      <PageHeader
        eyebrow="ADMIN WORKSPACE"
        title="Dashboard"
        description="Overview of your Junior Church gallery."
      />

      <div className="stats-grid">
        {stats.map(([label, value]) => (
          <div className="stat-card" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <section className="welcome-panel">
        <span className="eyebrow">MANAGEMENT</span>
        <h2>Keep the gallery up to date.</h2>
        <p>
          Use the administration sections to manage members,
          appoint leaders, publish updates and preserve memories.
        </p>
      </section>
    </>
  );
}