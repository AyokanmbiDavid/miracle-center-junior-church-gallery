
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  UploadCloud,
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
  getThrowbacks,
  createThrowback,
} from "../../services/throwbackService";

import { uploadImage, getImageUrl } from "../../services/uploadService";
import { supabase } from "../../lib/supabase";

async function runAction(password, action, payload) {
  const { data, error } = await supabase.functions.invoke(
    "admin-actions",
    { body: { password, action, ...payload } }
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

export default function Throwbacks() {
  const { password } = useAdminAuth();

  const { data = [], loading, error, refresh } =
    useGalleryData(getThrowbacks);

  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState("");

  const [search, setSearch] = useState("");

  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [message, setMessage] = useState("");

  // Live search
  const filteredMemories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return data;

    return data.filter((item) => {
      const description = (item.description || "").toLowerCase();
      const date = item.created_at
        ? new Date(item.created_at).toLocaleDateString().toLowerCase()
        : "";

      return (
        description.includes(query) ||
        date.includes(query)
      );
    });
  }, [data, search]);

  useEffect(() => {
    if (!file) {
      setPreview(editing?.image || "");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file, editing]);

  function startEdit(item) {
    setEditing({
      ...item,
      image: getImageUrl("gallery-images", item.image_path),
    });

    setDescription(item.description || "");
    setFile(null);
    setFailure("");
    setMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setDescription("");
    setFile(null);
    setEditing(null);
    setPreview("");
  }

  async function submit(event) {
    event.preventDefault();

    if (!file && !editing?.image_path) {
      setFailure("Please select an image.");
      return;
    }

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
        description,
        image_path,
      };

      if (editing) {
        await runAction(password, "update_throwback", {
          id: editing.id,
          ...payload,
        });

        setMessage("Memory updated successfully.");
      } else {
        await createThrowback(password, payload);
        setMessage("Memory added successfully.");
      }

      resetForm();
      await refresh();
    } catch (err) {
      setFailure(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(item) {
    if (!window.confirm("Delete this memory?")) return;

    try {
      await runAction(password, "delete_throwback", {
        id: item.id,
      });

      if (editing?.id === item.id) resetForm();

      await refresh();
    } catch (err) {
      setFailure(err.message);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="MEMORY ARCHIVE"
        title="Manage throwbacks"
        description="Preserve and organise special moments from our church."
      />

      <section className="admin-panel">
        <div className="admin-section-heading">
          <div>
            <span className="eyebrow">
              {editing ? "EDIT MEMORY" : "NEW MEMORY"}
            </span>
            <h3>{editing ? "Update memory" : "Add a memory"}</h3>
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
            Description
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this memory"
            />
          </label>

          <label className="file-input">
            <UploadCloud size={18} />
            {file ? "Change selected image" : "Choose image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              required={!editing}
            />
          </label>

          {preview && (
            <div className="upload-preview">
              <img src={preview} alt="Throwback preview" />

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
                  : "Add memory"}
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

      <section className="admin-panel">
        <div className="admin-section-heading">
          <div>
            <h3>Saved memories ({data.length})</h3>
            <p>Search and manage your archived memories.</p>
          </div>
        </div>

        {/* Visible search input */}
        <div className="admin-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search memories by description or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {!loading && !error && (
          <p className="search-results-count">
            {filteredMemories.length}{" "}
            {filteredMemories.length === 1 ? "memory" : "memories"} found
          </p>
        )}

        {loading ? (
          <LoadingScreen />
        ) : error ? (
          <EmptyState
            title="Unable to load memories"
            description={error}
          />
        ) : filteredMemories.length ? (
          <div className="admin-media-grid">
            {filteredMemories.map((item) => {
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
                        alt={item.description || "Memory"}
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
                      <strong>
                        {item.description || "Special memory"}
                      </strong>

                      <small>
                        {new Date(
                          item.created_at
                        ).toLocaleDateString()}
                      </small>
                    </div>

                    <div className="admin-media-actions">
                      <button
                        className="icon-button"
                        title="Edit memory"
                        onClick={() => startEdit(item)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="icon-button"
                        title="Download image"
                        disabled={!image}
                        onClick={() =>
                          downloadImage(
                            image,
                            item.description || "memory"
                          )
                        }
                      >
                        <Download size={16} />
                      </button>

                      <button
                        className="icon-button danger"
                        title="Delete memory"
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
        ) : search ? (
          <EmptyState
            title="No matching memories"
            description="Try another search term."
          />
        ) : (
          <EmptyState title="No memories uploaded" />
        )}
      </section>
    </>
  );
}
