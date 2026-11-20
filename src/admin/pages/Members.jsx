
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Download,
  Pencil,
  X,
  Save,
  ImagePlus,
  Search,
  Users,
  ChevronDown,
} from "lucide-react";

import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import LoadingScreen from "../../components/LoadingScreen";

import { useAdminAuth } from "../AdminAuthContext";
import { useGalleryData } from "../../hooks/useGalleryData";

import {
  getMembers,
  createMember,
} from "../../services/memberService";

import {
  uploadImage,
  getImageUrl,
} from "../../services/uploadService";

const classes = ["Toddlers", "Children", "Pre-teens", "Teenagers"];

const initialForm = {
  name: "",
  class_name: "Teenagers",
  role: "",
};

async function runAction(password, action, payload) {
  const { data, error } = await (
    await import("../../lib/supabase")
  ).supabase.functions.invoke("admin-actions", {
    body: { password, action, ...payload },
  });

  if (error) throw error;
  if (!data?.success) {
    throw new Error(data?.error || "Action failed");
  }

  return data.data;
}

async function downloadImage(url, name) {
  if (!url) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `${name.replace(/[^a-z0-9]/gi, "_")}.jpg`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export default function Members() {
  const { password } = useAdminAuth();
  const { data = [], loading, error, refresh } = useGalleryData(getMembers);

  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState("");
  const [search, setSearch] = useState("");

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failure, setFailure] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview(editing?.image || "");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file, editing]);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return data;

    return data.filter((member) =>
      [member.name, member.role, member.class_name]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [data, search]);

  const groupedMembers = useMemo(() => {
    return classes.map((className) => ({
      name: className,
      members: filteredMembers.filter(
        (member) => member.class_name === className
      ),
    }));
  }, [filteredMembers]);

  function changeField(key, value) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function startEdit(member) {
    setEditing({
      ...member,
      image: getImageUrl("member-photos", member.image_path),
    });

    setForm({
      name: member.name || "",
      class_name: member.class_name || "Teenagers",
      role: member.role || "",
    });

    setFile(null);
    setFailure("");
    setMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(initialForm);
    setFile(null);
    setEditing(null);
    setPreview("");
  }

  async function submit(event) {
    event.preventDefault();

    setBusy(true);
    setFailure("");
    setMessage("");

    try {
      let image_path = editing?.image_path || null;

      if (file) {
        image_path = await uploadImage({
          password,
          file,
          bucket: "member-photos",
        });
      }

      const payload = {
        ...form,
        image_path,
      };

      if (editing) {
        await runAction(password, "update_member", {
          id: editing.id,
          ...payload,
        });

        setMessage("Member updated successfully.");
      } else {
        await createMember(password, payload);
        setMessage("Member added successfully.");
      }

      resetForm();
      await refresh();
    } catch (err) {
      setFailure(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(member) {
    if (!window.confirm(`Delete ${member.name}?`)) return;

    setFailure("");

    try {
      await runAction(password, "delete_member", {
        id: member.id,
      });

      if (editing?.id === member.id) resetForm();

      await refresh();
    } catch (err) {
      setFailure(err.message);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="DIRECTORY"
        title="Manage members"
        description="Register, update and manage Junior Church members."
      />

      <section className="admin-panel">
        <div className="admin-section-heading">
          <div>
            <span className="eyebrow">
              {editing ? "EDIT RECORD" : "NEW RECORD"}
            </span>
            <h3>{editing ? "Update member" : "Add a member"}</h3>
          </div>

          {editing && (
            <button
              type="button"
              className="icon-button"
              onClick={resetForm}
            >
              <X size={18} />
            </button>
          )}
        </div>

        <form className="admin-form" onSubmit={submit}>
          <label>
            Full name
            <input
              value={form.name}
              onChange={(e) => changeField("name", e.target.value)}
              required
              placeholder="Member's full name"
            />
          </label>

          <label>
            Class
            <select
              value={form.class_name}
              onChange={(e) => changeField("class_name", e.target.value)}
            >
              {classes.map((className) => (
                <option key={className}>{className}</option>
              ))}
            </select>
          </label>

          <label>
            Role
            <input
              value={form.role}
              onChange={(e) => changeField("role", e.target.value)}
              placeholder="Optional role"
            />
          </label>

          <label className="file-input">
            <ImagePlus size={18} />
            {file ? "Change selected image" : "Choose profile photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          {preview && (
            <div className="upload-preview">
              <img src={preview} alt="Selected member preview" />
              <button
                type="button"
                className="preview-remove"
                onClick={() => {
                  setFile(null);
                  setPreview(editing?.image || "");
                }}
              >
                <X size={16} />
              </button>
              <span>Image preview</span>
            </div>
          )}

          <div className="admin-form-actions">
            <button className="btn btn-primary" disabled={busy}>
              {editing ? <Save size={17} /> : <Plus size={17} />}
              {busy
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Add member"}
            </button>

            {editing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && <p className="success-message">{message}</p>}
        {failure && <p className="form-error">{failure}</p>}
      </section>

      <section className="admin-panel">
        <div className="admin-section-heading">
          <div>
            <h3>Registered members</h3>
            <small>{data.length} members registered</small>
          </div>
          <Users size={21} />
        </div>

        <div className="admin-search">
          <Search size={18} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members by name, role or class..."
          />
          {search && (
            <button
              type="button"
              className="icon-button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {search && (
          <small className="search-results-count">
            {filteredMembers.length} matching members
          </small>
        )}

        {loading ? (
          <LoadingScreen />
        ) : error ? (
          <EmptyState title="Could not load members" description={error} />
        ) : data.length ? (
          <div className="member-class-groups">
            {groupedMembers.map(({ name, members }) => (
              members.length > 0 && (
                <section className="member-class-section" key={name}>
                  <div className="member-class-heading">
                    <div>
                      <h4>{name}</h4>
                      <small>
                        {members.length} {members.length === 1 ? "member" : "members"}
                      </small>
                    </div>
                    <ChevronDown size={18} />
                  </div>

                  <div className="admin-media-grid">
                    {members.map((member) => {
                      const image = getImageUrl(
                        "member-photos",
                        member.image_path
                      );

                      return (
                        <article className="admin-media-card" key={member.id}>
                          <div className="admin-media-image">
                            {image ? (
                              <img
                                src={image}
                                alt={member.name}
                                loading="lazy"
                              />
                            ) : (
                              <div className="admin-image-placeholder">
                                <ImagePlus size={25} />
                                <span>No photo</span>
                              </div>
                            )}
                          </div>

                          <div className="admin-media-details">
                            <div className="member-card-info">
                              <strong>{member.name}</strong>
                              {member.role && <small>{member.role}</small>}
                            </div>

                            <div className="admin-media-actions">
                              <button
                                type="button"
                                className="icon-button"
                                title="Edit member"
                                onClick={() => startEdit(member)}
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                className="icon-button"
                                title="Download photo"
                                disabled={!image}
                                onClick={() => downloadImage(image, member.name)}
                              >
                                <Download size={16} />
                              </button>

                              <button
                                type="button"
                                className="icon-button danger"
                                title="Delete member"
                                onClick={() => remove(member)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )
            ))}

            {!filteredMembers.length && (
              <EmptyState
                title="No matching members"
                description="Try another name, role or class."
              />
            )}
          </div>
        ) : (
          <EmptyState title="No members registered" />
        )}
      </section>
    </>
  );
}
