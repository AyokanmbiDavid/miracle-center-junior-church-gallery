import { useState } from "react";
import { Plus, Award } from "lucide-react";

import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import LoadingScreen from "../../components/LoadingScreen";

import { useAdminAuth } from "../AdminAuthContext";
import { useGalleryData } from "../../hooks/useGalleryData";

import { getMembers } from "../../services/memberService";

import {
  getPositions,
  createPosition,
  assignMember,
  unassignMember,
} from "../../services/excoService";

export default function Exco() {
  const { password } = useAdminAuth();

  const positions = useGalleryData(getPositions);
  const members = useGalleryData(getMembers);

  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function addPosition(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      await createPosition(password, name);
      setName("");
      await positions.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function changeAssignment(position, memberId) {
    setError("");

    try {
      if (memberId) {
        await assignMember(
          password,
          memberId,
          position.id
        );
      } else {
        await unassignMember(password, position.id);
      }

      await members.refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="LEADERSHIP"
        title="Manage Exco"
        description="Create leadership positions and appoint members."
      />

      <section className="admin-panel">
        <h3>Create a position</h3>

        <form className="inline-form" onSubmit={addPosition}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Position name"
            required
          />

          <button className="btn btn-primary" disabled={busy}>
            <Plus size={17} />
            Add position
          </button>
        </form>

        {error && <p className="form-error">{error}</p>}
      </section>

      <section className="admin-panel">
        <h3>Leadership positions</h3>

        {positions.loading || members.loading ? (
          <LoadingScreen />
        ) : positions.data.length ? (
          positions.data.map((position) => {
            const holder = members.data.find(
              (member) =>
                member.exco_position_id === position.id
            );

            return (
              <div className="admin-list-row" key={position.id}>
                <div className="position-icon">
                  <Award size={19} />
                </div>

                <div className="admin-row-info">
                  <strong>{position.position_name}</strong>
                  <small>
                    {holder?.name || "Currently vacant"}
                  </small>
                </div>

                <select
                  value={holder?.id || ""}
                  onChange={(e) =>
                    changeAssignment(position, e.target.value)
                  }
                >
                  <option value="">Unassigned</option>

                  {members.data.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            );
          })
        ) : (
          <EmptyState title="No positions created" />
        )}
      </section>
    </>
  );
}