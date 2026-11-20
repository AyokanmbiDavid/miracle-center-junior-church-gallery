
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
  Megaphone,
  Sparkles,
  CalendarDays,
  Layers3,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Upload,
  Newspaper,
  CircleDot,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

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

const classOptions = [
  "All Classes",
  "Toddlers",
  "Children",
  "Pre-teens",
  "Teenagers",
];

const classStyles = {
  "All Classes": {
    surface: "bg-[#E4F2EF]",
    text: "text-[#176D68]",
    dot: "bg-[#176D68]",
  },
  Toddlers: {
    surface: "bg-[#FCEBDD]",
    text: "text-[#A45D2D]",
    dot: "bg-[#D68B51]",
  },
  Children: {
    surface: "bg-[#EAE7F7]",
    text: "text-[#685A9C]",
    dot: "bg-[#8979C0]",
  },
  "Pre-teens": {
    surface: "bg-[#E3EEF9]",
    text: "text-[#426F9D]",
    dot: "bg-[#6194C3]",
  },
  Teenagers: {
    surface: "bg-[#F8E7EC]",
    text: "text-[#A64D69]",
    dot: "bg-[#CE7894]",
  },
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

function StatCard({ icon: Icon, label, value, tone, description }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`relative overflow-hidden rounded-[28px] p-5 ${tone.surface}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#71847B]">
            {label}
          </p>

          <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-[#20302D]">
            {value}
          </h3>

          <p className="mt-1 text-xs text-[#71847B]">
            {description}
          </p>
        </div>

        <div className={`rounded-2xl p-3 ${tone.icon}`}>
          <Icon size={21} />
        </div>
      </div>

      <div className={`absolute -bottom-9 -right-7 h-24 w-24 rounded-full ${tone.shape}`} />
    </motion.div>
  );
}

function Notice({ type, children, onClose }) {
  const success = type === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8 }}
      className={`flex items-start gap-3 rounded-[20px] p-4 ${
        success
          ? "bg-[#E4F2EF] text-[#176D68]"
          : "bg-[#FCE9E7] text-[#B34F48]"
      }`}
    >
      {success ? (
        <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
      ) : (
        <AlertCircle size={20} className="mt-0.5 shrink-0" />
      )}

      <p className="flex-1 text-sm font-medium">{children}</p>

      <button
        type="button"
        onClick={onClose}
        className="rounded-full p-1 transition hover:bg-black/5"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#176D68]">
          {eyebrow}
        </p>

        <h2 className="text-2xl font-extrabold tracking-tight text-[#20302D] sm:text-[28px]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-[#81918B]">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function StatusCard({ item, onEdit, onDownload, onArchive, onDelete }) {
  const image = getImageUrl("gallery-images", item.image_path);
  const style = classStyles[item.class_name] || classStyles["All Classes"];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="group overflow-hidden rounded-[28px] border border-[#E8EFEB] bg-white shadow-[0_5px_20px_rgba(32,48,45,0.035)] transition-shadow hover:shadow-[0_14px_35px_rgba(32,48,45,0.09)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F0F6F2]">
        {image ? (
          <img
            src={image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-[#9BAAA2]">
            <ImageIcon size={34} strokeWidth={1.4} />
            <span className="text-xs font-semibold">No image attached</span>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${style.surface} ${style.text}`}>
            {item.class_name}
          </span>

          {item.is_new_sunday && (
            <span className="flex items-center gap-1 rounded-full bg-[#FFF0D7] px-3 py-1.5 text-[10px] font-bold text-[#96601F]">
              <Sparkles size={11} />
              Sunday highlight
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 rounded-full bg-black/45 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
          ACTIVE
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-4 min-h-[66px]">
          <h3 className="line-clamp-2 text-base font-extrabold leading-snug text-[#20302D]">
            {item.title}
          </h3>

          <p className="mt-2 flex items-center gap-1.5 text-xs text-[#81918B]">
            <CircleDot size={12} />
            {item.class_name}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-[#EDF1EE] pt-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9BAAA2]">
            Manage update
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              title="Edit update"
              aria-label="Edit update"
              className="rounded-full p-2.5 text-[#176D68] transition hover:bg-[#E4F2EF]"
            >
              <Pencil size={16} />
            </button>

            <button
              type="button"
              onClick={onDownload}
              title="Download image"
              aria-label="Download image"
              disabled={!image}
              className="rounded-full p-2.5 text-[#58736A] transition hover:bg-[#F0F6F2] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Download size={16} />
            </button>

            <button
              type="button"
              onClick={onArchive}
              title="Archive update"
              aria-label="Archive update"
              className="rounded-full p-2.5 text-[#9B762E] transition hover:bg-[#FFF4DF]"
            >
              <Archive size={16} />
            </button>

            <button
              type="button"
              onClick={onDelete}
              title="Delete update"
              aria-label="Delete update"
              className="rounded-full p-2.5 text-[#BD5A55] transition hover:bg-[#FCE9E7]"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
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
  const [selectedClass, setSelectedClass] = useState("All Classes");

  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview(editing?.image || "");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file, editing]);

  const filteredStatuses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return data.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const className = (item.class_name || "").toLowerCase();

      const highlight = item.is_new_sunday
        ? "sunday highlight"
        : "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        className.includes(query) ||
        highlight.includes(query);

      const matchesClass =
        selectedClass === "All Classes" ||
        item.class_name === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [data, search, selectedClass]);

  const highlightedCount = data.filter(
    (item) => item.is_new_sunday
  ).length;

  const classCount = new Set(
    data.map((item) => item.class_name)
  ).size;

  function changeField(key, value) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function startEdit(item) {
    setEditing({
      ...item,
      image: getImageUrl("gallery-images", item.image_path),
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
      setFailure(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function archive(item) {
    if (!window.confirm(`Archive "${item.title}"?`)) {
      return;
    }

    try {
      setFailure("");
      await archiveStatus(password, item.id);

      if (editing?.id === item.id) {
        resetForm();
      }

      await refresh();
    } catch (err) {
      setFailure(err.message || "Could not archive update.");
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) {
      return;
    }

    try {
      setFailure("");
      await runAction(password, "delete_status", {
        id: item.id,
      });

      if (editing?.id === item.id) {
        resetForm();
      }

      await refresh();
    } catch (err) {
      setFailure(err.message || "Could not delete update.");
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="ANNOUNCEMENTS"
        title="Manage status"
        description="Publish, update and organise church updates."
        icon={Megaphone}
      />

      {/* OVERVIEW */}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Newspaper}
          label="Published updates"
          value={data.length}
          description="Currently active"
          tone={{
            surface: "bg-[#E4F2EF]",
            icon: "bg-white/75 text-[#176D68]",
            shape: "bg-[#176D68]/[0.06]",
          }}
        />

        <StatCard
          icon={Sparkles}
          label="Sunday highlights"
          value={highlightedCount}
          description="Special announcements"
          tone={{
            surface: "bg-[#FFF2DF]",
            icon: "bg-white/75 text-[#A56A25]",
            shape: "bg-[#D99B48]/[0.08]",
          }}
        />

        <StatCard
          icon={Layers3}
          label="Classes reached"
          value={classCount}
          description="Different class groups"
          tone={{
            surface: "bg-[#EAE7F7]",
            icon: "bg-white/75 text-[#7565A8]",
            shape: "bg-[#7565A8]/[0.07]",
          }}
        />

        <StatCard
          icon={ImageIcon}
          label="With images"
          value={data.filter((item) => item.image_path).length}
          description="Visual announcements"
          tone={{
            surface: "bg-[#F8E7EC]",
            icon: "bg-white/75 text-[#A64D69]",
            shape: "bg-[#A64D69]/[0.07]",
          }}
        />
      </section>

      {/* FORM WORKSPACE */}

      <section
        id="status-editor"
        className="overflow-hidden rounded-[32px] border border-[#E8EFEB] bg-white shadow-[0_8px_35px_rgba(32,48,45,0.045)]"
      >
        <div className="relative overflow-hidden bg-[#E4F2EF] px-5 py-6 sm:px-8 sm:py-7">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/35" />
          <div className="absolute -bottom-20 right-32 h-36 w-36 rounded-full bg-[#176D68]/[0.06]" />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#176D68]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#176D68]" />
                {editing ? "Editing workspace" : "Publishing workspace"}
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-[#20302D] sm:text-3xl">
                {editing ? "Refine your update" : "Create something new"}
              </h2>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#58736A]">
                {editing
                  ? "Make your changes and save the updated announcement."
                  : "Share important moments and announcements with your church community."}
              </p>
            </div>

            <div className="hidden h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[26px] bg-white/70 text-[#176D68] shadow-sm sm:flex">
              {editing ? (
                <Pencil size={32} />
              ) : (
                <Megaphone size={34} />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-8">
          <AnimatePresence mode="wait">
            {message && (
              <Notice
                type="success"
                onClose={() => setMessage("")}
              >
                {message}
              </Notice>
            )}

            {failure && (
              <Notice
                type="error"
                onClose={() => setFailure("")}
              >
                {failure}
              </Notice>
            )}
          </AnimatePresence>

          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
              <div className="space-y-2">
                <label
                  htmlFor="status-title"
                  className="text-sm font-bold text-[#20302D]"
                >
                  Announcement title
                </label>

                <input
                  id="status-title"
                  value={form.title}
                  onChange={(e) =>
                    changeField("title", e.target.value)
                  }
                  required
                  placeholder="Give your update a meaningful title..."
                  className="h-14 w-full rounded-[18px] border border-[#E3EBE6] bg-[#F8FAF8] px-4 text-sm font-medium text-[#20302D] outline-none transition placeholder:text-[#A0AEA6] focus:border-[#176D68] focus:bg-white focus:ring-4 focus:ring-[#176D68]/[0.08]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="status-class"
                  className="text-sm font-bold text-[#20302D]"
                >
                  Target audience
                </label>

                <select
                  id="status-class"
                  value={form.class_name}
                  onChange={(e) =>
                    changeField("class_name", e.target.value)
                  }
                  className="h-14 w-full rounded-[18px] border border-[#E3EBE6] bg-[#F8FAF8] px-4 text-sm font-semibold text-[#20302D] outline-none transition focus:border-[#176D68] focus:bg-white focus:ring-4 focus:ring-[#176D68]/[0.08]"
                >
                  {classOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* IMAGE UPLOAD */}

            <div className="space-y-3">
              <label className="text-sm font-bold text-[#20302D]">
                Cover image
              </label>

              <label className="group flex cursor-pointer flex-col items-center justify-center rounded-[26px] border-2 border-dashed border-[#CBDCD2] bg-[#F8FAF8] px-5 py-8 text-center transition hover:border-[#176D68] hover:bg-[#F0F6F2]">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) =>
                    setFile(e.target.files?.[0] || null)
                  }
                />

                <div className="mb-3 rounded-[19px] bg-[#E4F2EF] p-4 text-[#176D68] transition group-hover:scale-105">
                  <Upload size={25} />
                </div>

                <span className="text-sm font-extrabold text-[#20302D]">
                  {file ? file.name : "Choose an image to upload"}
                </span>

                <span className="mt-1 text-xs text-[#81918B]">
                  JPEG, PNG or WEBP · Maximum 10 MB
                </span>

                <span className="mt-4 rounded-full bg-[#176D68] px-5 py-2.5 text-xs font-bold text-white transition group-hover:bg-[#105A55]">
                  Browse images
                </span>
              </label>

              <AnimatePresence>
                {preview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="relative overflow-hidden rounded-[24px] bg-[#F0F6F2]"
                  >
                    <img
                      src={preview}
                      alt="Status image preview"
                      className="max-h-[300px] w-full object-cover"
                    />

                    <div className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                      Image preview
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreview(editing?.image || "");
                      }}
                      title="Remove selected image"
                      aria-label="Remove selected image"
                      className="absolute right-3 top-3 rounded-full bg-white p-2.5 text-[#B34F48] shadow-lg transition hover:scale-105"
                    >
                      <X size={17} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SUNDAY HIGHLIGHT */}

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[24px] bg-[#FFF5E6] p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-[16px] bg-white p-3 text-[#A56A25]">
                  <Sparkles size={21} />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-[#704D20]">
                    Sunday highlight
                  </p>

                  <p className="mt-0.5 text-xs text-[#9C7B4D]">
                    Give this announcement special recognition
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={form.is_new_sunday}
                onChange={(e) =>
                  changeField("is_new_sunday", e.target.checked)
                }
                className="h-5 w-5 shrink-0 accent-[#176D68]"
              />
            </label>

            {/* FORM ACTIONS */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#EDF1EE] pt-5 sm:flex-row sm:items-center">
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={busy}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#F0F3F1] px-6 text-sm font-bold text-[#58736A] transition hover:bg-[#E6ECE8] disabled:opacity-50"
                >
                  <X size={17} />
                  Cancel editing
                </button>
              )}

              <button
                type="submit"
                disabled={busy}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#176D68] px-7 text-sm font-bold text-white shadow-[0_5px_15px_rgba(23,109,104,0.18)] transition hover:-translate-y-0.5 hover:bg-[#105A55] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto"
              >
                {busy ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : editing ? (
                  <Save size={17} />
                ) : (
                  <Plus size={18} />
                )}

                {busy
                  ? "Saving..."
                  : editing
                    ? "Save changes"
                    : "Publish announcement"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* CONTENT LIBRARY */}

      <section className="space-y-5">
        <SectionHeading
          eyebrow="CONTENT LIBRARY"
          title="Your announcements"
          description="Manage everything currently published in the gallery."
          action={
            <span className="rounded-full bg-[#E4F2EF] px-4 py-2 text-xs font-extrabold text-[#176D68]">
              {data.length} active
            </span>
          }
        />

        {/* SEARCH */}

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex h-13 min-h-[52px] flex-1 items-center gap-3 rounded-full border border-[#E8EFEB] bg-white px-5 transition focus-within:border-[#176D68] focus-within:ring-4 focus-within:ring-[#176D68]/[0.07]">
            <Search size={19} className="shrink-0 text-[#81918B]" />

            <input
              type="search"
              placeholder="Search announcements, classes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#20302D] outline-none placeholder:text-[#A0AEA6]"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="rounded-full p-1.5 text-[#81918B] hover:bg-[#F0F6F2]"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex min-h-[52px] items-center gap-2 overflow-x-auto rounded-full border border-[#E8EFEB] bg-white px-2 py-1.5">
            {classOptions.map((name) => {
              const active = selectedClass === name;

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedClass(name)}
                  className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition ${
                    active
                      ? "bg-[#176D68] text-white shadow-sm"
                      : "text-[#71847B] hover:bg-[#F0F6F2]"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {!loading && !error && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-[#81918B]">
              Showing{" "}
              <span className="font-extrabold text-[#20302D]">
                {filteredStatuses.length}
              </span>{" "}
              of {data.length} announcements
            </p>

            {(search || selectedClass !== "All Classes") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedClass("All Classes");
                }}
                className="text-xs font-bold text-[#176D68] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {loading ? (
          <LoadingScreen message="Loading announcements..." />
        ) : error ? (
          <EmptyState
            title="Unable to load updates"
            description={error}
          />
        ) : filteredStatuses.length ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredStatuses.map((item) => (
                <StatusCard
                  key={item.id}
                  item={item}
                  onEdit={() => startEdit(item)}
                  onDownload={() =>
                    downloadImage(
                      getImageUrl("gallery-images", item.image_path),
                      item.title
                    )
                  }
                  onArchive={() => archive(item)}
                  onDelete={() => remove(item)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="rounded-[30px] border border-dashed border-[#DCE7E0] bg-[#F8FAF8] px-5 py-12">
            <EmptyState
              title={
                search || selectedClass !== "All Classes"
                  ? "No matching announcements"
                  : "No active announcements"
              }
              description={
                search || selectedClass !== "All Classes"
                  ? "Try changing your search or class filter."
                  : "Your published announcements will appear here."
              }
            />
          </div>
        )}
      </section>

      {/* BOTTOM INFORMATION */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[30px] bg-[#203F3A] p-6 text-white sm:p-8"
      >
        <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-white/[0.05]" />
        <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-[#8BC6AC]/[0.09]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <div className="mb-3 flex items-center gap-2 text-[#A8D9C4]">
              <CalendarDays size={17} />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em]">
                Keep the community informed
              </span>
            </div>

            <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Every update tells a story.
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Keep announcements clear, relevant and up to date for every class.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              document.getElementById("status-editor")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#C5E8D6] px-6 text-sm font-extrabold text-[#174B3E] transition hover:-translate-y-0.5 hover:bg-white"
          >
            <Plus size={18} />
            New announcement
            <ArrowUpRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
