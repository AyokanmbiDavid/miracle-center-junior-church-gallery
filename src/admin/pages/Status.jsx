
import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Trash2,
  Archive,
  Download,
  Pencil,
  Save,
  X,
  ImagePlus,
  Search,
} from "lucide-react";

import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import LoadingScreen from "../../components/LoadingScreen";

import { useAdminAuth } from "../AdminAuthContext";
import { useGalleryData } from "../../hooks/useGalleryData";

import {
  getStatuses,
  createStatus,
  archiveStatus,
} from "../../services/statusService";

import {
  uploadImage,
  getImageUrl,
} from "../../services/uploadService";

import { supabase } from "../../lib/supabase";

const initialForm = {
  title: "",
  class_name: "All Classes",
  is_new_sunday: false,
};

async function runAction(password, action, payload) {
  const { data, error } = await supabase.functions.invoke(
    "admin-actions",
    {
      body: {
        password,
        action,
        ...payload,
      },
    }
  );

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

    if (!response.ok) {
      throw new Error("Download failed");
    }

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

export default function Status() {
  const { password } = useAdminAuth();

  const {
    data = [],
    loading,
    error,
    refresh,
  } = useGalleryData(
    () => getStatuses(false),
    []
  );

  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState("");

  const [search, setSearch] = useState("");

  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [message, setMessage] = useState("");

  // IMAGE PREVIEW
  useEffect(() => {
    if (!file) {
      setPreview(editing?.image || "");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file, editing]);

  // SEARCH FILTER
  const filteredStatuses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return data;

    return data.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const className = (item.class_name || "").toLowerCase();

      const highlight = item.is_new_sunday
        ? "sunday highlight"
        : "";

      return (
        title.includes(query) ||
        className.includes(query) ||
        highlight.includes(query)
      );
    });
  }, [data, search]);

  function changeField(key, value) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function startEdit(item) {
    setEditing({
      ...item,
      image: getImageUrl(
        "gallery-images",
        item.image_path
      ),
    });

    setForm({
      title: item.title || "",
      class_name: item.class_name || "All Classes",
      is_new_sunday: Boolean(item.is_new_sunday),
    });

    setFile(null);
    setFailure("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
          bucket: "gallery-images",
        });
      }

      const payload = {
        ...form,
        image_path,
      };

      if (editing) {
        await runAction(password, "update_status", {
          id: editing.id,
          ...payload,
        });

        setMessage("Update saved successfully.");
      } else {
        await createStatus(password, payload);

        setMessage("Status published successfully.");
      }

      resetForm();
      await refresh();
    } catch (err) {
      setFailure(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function archive(item) {
    if (!window.confirm(`Archive "${item.title}"?`)) {
      return;
    }

    try {
      await archiveStatus(password, item.id);

      if (editing?.id === item.id) {
        resetForm();
      }

      await refresh();
    } catch (err) {
      setFailure(err.message);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) {
      return;
    }

    try {
      await runAction(password, "delete_status", {
        id: item.id,
      });

      if (editing?.id === item.id) {
        resetForm();
      }

      await refresh();
    } catch (err) {
      setFailure(err.message);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="ANNOUNCEMENTS"
        title="Manage status"
        description="Publish, update and organise church updates."
      />

      {/* CREATE / EDIT FORM */}

      <section className="admin-panel">
        <div className="admin-section-heading">
          <div>
            <span className="eyebrow">
              {editing ? "EDIT RECORD" : "NEW RECORD"}
            </span>

            <h3>
              {editing ? "Edit update" : "Create an update"}
            </h3>
          </div>

          {editing && (
            <button
              type="button"
              className="icon-button"
              onClick={resetForm}
              title="Close editing"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <form className="admin-form" onSubmit={submit}>
          <label>
            Title

            <input
              value={form.title}
              onChange={(e) =>
                changeField("title", e.target.value)
              }
              required
              placeholder="Update title"
            />
          </label>

          <label>
            Class

            <select
              value={form.class_name}
              onChange={(e) =>
                changeField("class_name", e.target.value)
              }
            >
              <option>All Classes</option>
              <option>Toddlers</option>
              <option>Children</option>
              <option>Pre-teens</option>
              <option>Teenagers</option>
            </select>
          </label>

          <label className="file-input">
            <ImagePlus size={18} />

            {file ? "Change selected image" : "Choose image"}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
            />
          </label>

          {preview && (
            <div className="upload-preview">
              <img
                src={preview}
                alt="Status image preview"
              />

              <button
                type="button"
                className="preview-remove"
                onClick={() => {
                  setFile(null);
                  setPreview(editing?.image || "");
                }}
                title="Remove selected image"
              >
                <X size={16} />
              </button>

              <span>Image preview</span>
            </div>
          )}

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.is_new_sunday}
              onChange={(e) =>
                changeField(
                  "is_new_sunday",
                  e.target.checked
                )
              }
            />

            Sunday highlight
          </label>

          <div className="admin-form-actions">
            <button
              className="btn btn-primary"
              disabled={busy}
            >
              {editing ? (
                <Save size={17} />
              ) : (
                <Plus size={17} />
              )}

              {busy
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Publish update"}
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

        {message && (
          <p className="success-message">{message}</p>
        )}

        {failure && (
          <p className="form-error">{failure}</p>
        )}
      </section>

      {/* ACTIVE UPDATES */}

      <section className="admin-panel">
        <div className="admin-section-heading">
          <div>
            <span className="eyebrow">
              CONTENT LIBRARY
            </span>

            <h3>
              Active updates ({data.length})
            </h3>
          </div>
        </div>

        {/* SEARCH */}

        <div className="admin-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search by title, class or highlight..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="icon-button"
              onClick={() => setSearch("")}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {!loading && !error && (
          <span className="search-results-count">
            Showing {filteredStatuses.length} of {data.length} updates
          </span>
        )}

        {loading ? (
          <LoadingScreen />
        ) : error ? (
          <EmptyState
            title="Unable to load updates"
            description={error}
          />
        ) : filteredStatuses.length ? (
          <div className="admin-media-grid">
            {filteredStatuses.map((item) => {
              const image = getImageUrl(
                "gallery-images",
                item.image_path
              );

              return (
                <article
                  className="admin-media-card"
                  key={item.id}
                >
                  <div className="admin-media-image">
                    {image ? (
                      <img
                        src={image}
                        alt={item.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="admin-image-placeholder">
                        <ImagePlus size={28} />
                        <span>No image</span>
                      </div>
                    )}
                  </div>

                  <div className="admin-media-details">
                    <div>
                      <strong>{item.title}</strong>

                      <small>{item.class_name}</small>

                      {item.is_new_sunday && (
                        <small>Sunday highlight</small>
                      )}
                    </div>

                    <div className="admin-media-actions">
                      <button
                        type="button"
                        className="icon-button"
                        title="Edit update"
                        onClick={() => startEdit(item)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="icon-button"
                        title="Download image"
                        disabled={!image}
                        onClick={() =>
                          downloadImage(image, item.title)
                        }
                      >
                        <Download size={16} />
                      </button>

                      <button
                        type="button"
                        className="icon-button"
                        title="Archive update"
                        onClick={() => archive(item)}
                      >
                        <Archive size={16} />
                      </button>

                      <button
                        type="button"
                        className="icon-button danger"
                        title="Delete update"
                        onClick={() => remove(item)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title={
              search
                ? "No matching updates"
                : "No active updates"
            }
            description={
              search
                ? "Try another title or class name."
                : "Your published updates will appear here."
            }
          />
        )}
      </section>
    </>
  );
}
