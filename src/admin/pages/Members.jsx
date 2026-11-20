
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
  Crown,
  Sparkles,
  UserRound,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const classThemes = {
  Toddlers: {
    surface: "bg-[#FCEDE9]",
    text: "text-[#A64F3D]",
    icon: "bg-[#F8DCD4]",
    dot: "bg-[#D98975]",
  },
  Children: {
    surface: "bg-[#FFF2DC]",
    text: "text-[#93631D]",
    icon: "bg-[#F9E5BB]",
    dot: "bg-[#D8A84F]",
  },
  "Pre-teens": {
    surface: "bg-[#EAE7F7]",
    text: "text-[#6552A0]",
    icon: "bg-[#DDD5F5]",
    dot: "bg-[#8D7BC5]",
  },
  Teenagers: {
    surface: "bg-[#E4F2EF]",
    text: "text-[#176D68]",
    icon: "bg-[#CCE9DF]",
    dot: "bg-[#299B78]",
  },
};

const initialForm = {
  name: "",
  class_name: "Teenagers",
  role: "",
};

async function runAction(password, action, payload) {
  const { supabase } = await import("../../lib/supabase");

  const { data, error } = await supabase.functions.invoke("admin-actions", {
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

function Notice({ type, children, onClose }) {
  const success = type === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      role="status"
      className={`flex items-start gap-3 rounded-[20px] border p-4 ${
        success
          ? "border-[#D3EADF] bg-[#EAF5EE] text-[#176D68]"
          : "border-[#F1D4CE] bg-[#FCEDE9] text-[#A64F3D]"
      }`}
    >
      {success ? (
        <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
      ) : (
        <AlertCircle size={19} className="mt-0.5 shrink-0" />
      )}

      <p className="flex-1 text-sm font-semibold leading-relaxed">
        {children}
      </p>

      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-full p-1 transition hover:bg-black/5"
        aria-label="Dismiss message"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#176D68]">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-1 font-['Plus_Jakarta_Sans'] text-xl font-extrabold tracking-tight text-[#20302D] sm:text-2xl">
          {title}
        </h2>

        {description && (
          <p className="mt-1.5 text-sm text-[#81918B]">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function MemberCard({ member, onEdit, onDelete, onDownload }) {
  const image = getImageUrl("member-photos", member.image_path);
  const theme = classThemes[member.class_name] || classThemes.Teenagers;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-[27px] border border-[#E8EFEB] bg-white shadow-[0_4px_18px_rgba(32,48,45,0.035)] transition-shadow hover:shadow-[0_14px_30px_rgba(32,48,45,0.09)]"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-[#E7F2ED]">
        {image ? (
          <img
            src={image}
            alt={member.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-[#81918B]">
            <div className="flex size-16 items-center justify-center rounded-[23px] bg-white">
              <UserRound size={28} />
            </div>
            <span className="text-xs font-semibold">No photo available</span>
          </div>
        )}

        <div className="absolute left-3 top-3">
          <span className={`rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold shadow-sm backdrop-blur-md ${theme.text}`}>
            {member.class_name}
          </span>
        </div>

        {member.exco_positions?.position_name && (
          <div className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-[#FFF1CE] text-[#93631D] shadow-sm">
            <Crown size={17} />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="min-w-0">
          <h3 className="truncate font-['Plus_Jakarta_Sans'] text-sm font-extrabold text-[#20302D]">
            {member.name}
          </h3>

          <p className="mt-1 truncate text-xs font-medium text-[#81918B]">
            {member.role || "Junior Church Member"}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className={`size-2 shrink-0 rounded-full ${theme.dot}`} />
            <span className="truncate text-[10px] font-bold text-[#71847B]">
              {member.exco_positions?.position_name || "Member"}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              title="Edit member"
              aria-label={`Edit ${member.name}`}
              onClick={() => onEdit(member)}
              className="flex size-9 items-center justify-center rounded-full bg-[#E4F2EF] text-[#176D68] transition hover:bg-[#CCE9DF] active:scale-90"
            >
              <Pencil size={15} />
            </button>

            <button
              type="button"
              title="Download photo"
              aria-label={`Download ${member.name}'s photo`}
              disabled={!image}
              onClick={() => onDownload(image, member.name)}
              className="flex size-9 items-center justify-center rounded-full bg-[#F0F6F2] text-[#53675F] transition hover:bg-[#E4F2EF] active:scale-90 disabled:opacity-30"
            >
              <Download size={15} />
            </button>

            <button
              type="button"
              title="Delete member"
              aria-label={`Delete ${member.name}`}
              onClick={() => onDelete(member)}
              className="flex size-9 items-center justify-center rounded-full bg-[#FCEDE9] text-[#A64F3D] transition hover:bg-[#F8DCD4] active:scale-90"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Members() {
  const { password } = useAdminAuth();
  const { data = [], loading, error, refresh } = useGalleryData(getMembers);

  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState("");
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");

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

    return data.filter((member) => {
      const matchesSearch =
        !query ||
        [member.name, member.role, member.class_name]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));

      const matchesClass =
        selectedClass === "All Classes" ||
        member.class_name === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [data, search, selectedClass]);

  const groupedMembers = useMemo(() => {
    return classes.map((className) => ({
      name: className,
      members: filteredMembers.filter(
        (member) => member.class_name === className
      ),
    }));
  }, [filteredMembers]);

  const classCounts = useMemo(() => {
    return data.reduce((counts, member) => {
      counts[member.class_name] = (counts[member.class_name] || 0) + 1;
      return counts;
    }, {});
  }, [data]);

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
    setFailure("");
    setMessage("");
  }

  function selectFile(event) {
    const selected = event.target.files?.[0] || null;

    if (!selected) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(selected.type)) {
      setFailure("Please select a JPEG, PNG or WEBP image.");
      event.target.value = "";
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setFailure("Image size must not exceed 10 MB.");
      event.target.value = "";
      return;
    }

    setFailure("");
    setFile(selected);
  }

  async function submit(event) {
    event.preventDefault();

    if (busy) return;

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

      setForm(initialForm);
      setFile(null);
      setEditing(null);
      setPreview("");

      await refresh();
    } catch (err) {
      setFailure(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(member) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.name}?`
    );

    if (!confirmed) return;

    setFailure("");
    setMessage("");

    try {
      await runAction(password, "delete_member", {
        id: member.id,
      });

      if (editing?.id === member.id) {
        resetForm();
      }

      setMessage(`${member.name} was deleted successfully.`);
      await refresh();
    } catch (err) {
      setFailure(err.message || "Could not delete member.");
    }
  }

  return (
    <div className="space-y-8 pb-14">
      <PageHeader
        eyebrow="DIRECTORY MANAGEMENT"
        title="Manage members"
        description="Register, update and organise the people who make up your Junior Church family."
        icon={Users}
      />

      {/* Overview */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {classes.map((className, index) => {
          const theme = classThemes[className];

          return (
            <motion.button
              key={className}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setSelectedClass(
                selectedClass === className ? "All Classes" : className
              )}
              className={`rounded-[25px] p-4 text-left transition-all ${theme.surface} ${
                selectedClass === className ? "ring-2 ring-[#176D68] ring-offset-2" : ""
              }`}
            >
              <div className={`flex size-10 items-center justify-center rounded-[15px] ${theme.icon} ${theme.text}`}>
                <Users size={19} />
              </div>

              <p className="mt-4 font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#20302D]">
                {classCounts[className] || 0}
              </p>

              <p className={`mt-1 text-xs font-bold ${theme.text}`}>
                {className}
              </p>
            </motion.button>
          );
        })}
      </section>

      {/* Add / Edit member form */}
      <section
        id="member-form"
        className="overflow-hidden rounded-[34px] border border-[#E8EFEB] bg-white shadow-[0_5px_24px_rgba(32,48,45,0.04)]"
      >
        <div className="flex items-center justify-between gap-4 bg-[#E4F2EF] px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-[18px] bg-white text-[#176D68] shadow-sm">
              {editing ? <Pencil size={22} /> : <Plus size={23} />}
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#176D68]">
                {editing ? "EDIT RECORD" : "NEW RECORD"}
              </p>

              <h2 className="mt-0.5 font-['Plus_Jakarta_Sans'] text-lg font-extrabold text-[#20302D] sm:text-xl">
                {editing ? "Update member" : "Add a member"}
              </h2>
            </div>
          </div>

          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="flex size-10 items-center justify-center rounded-full bg-white text-[#53675F] transition hover:bg-[#FCEDE9] hover:text-[#A64F3D]"
              aria-label="Cancel editing"
            >
              <X size={19} />
            </button>
          )}
        </div>

        <form onSubmit={submit} className="space-y-6 p-5 sm:p-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="member-name"
                className="text-sm font-bold text-[#53675F]"
              >
                Full name
              </label>

              <input
                id="member-name"
                value={form.name}
                onChange={(e) => changeField("name", e.target.value)}
                required
                placeholder="Member's full name"
                disabled={busy}
                className="h-13 w-full rounded-[17px] border border-[#E5ECE8] bg-[#F8FAF8] px-4 text-sm font-medium text-[#20302D] outline-none transition placeholder:text-[#A0AEA7] focus:border-[#176D68] focus:bg-white focus:ring-4 focus:ring-[#176D68]/10"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="member-class"
                className="text-sm font-bold text-[#53675F]"
              >
                Class
              </label>

              <div className="relative">
                <select
                  id="member-class"
                  value={form.class_name}
                  onChange={(e) => changeField("class_name", e.target.value)}
                  disabled={busy}
                  className="h-13 w-full appearance-none rounded-[17px] border border-[#E5ECE8] bg-[#F8FAF8] px-4 pr-11 text-sm font-semibold text-[#20302D] outline-none transition focus:border-[#176D68] focus:bg-white focus:ring-4 focus:ring-[#176D68]/10"
                >
                  {classes.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#81918B]"
                />
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="member-role"
                className="text-sm font-bold text-[#53675F]"
              >
                Role
                <span className="ml-2 text-xs font-medium text-[#A0AEA7]">
                  Optional
                </span>
              </label>

              <input
                id="member-role"
                value={form.role}
                onChange={(e) => changeField("role", e.target.value)}
                placeholder="e.g. Choir member, Class assistant..."
                disabled={busy}
                className="h-13 w-full rounded-[17px] border border-[#E5ECE8] bg-[#F8FAF8] px-4 text-sm font-medium text-[#20302D] outline-none transition placeholder:text-[#A0AEA7] focus:border-[#176D68] focus:bg-white focus:ring-4 focus:ring-[#176D68]/10"
              />
            </div>
          </div>

          {/* Image upload */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-[#53675F]">
                Profile photograph
              </h3>

              <p className="mt-1 text-xs text-[#81918B]">
                JPEG, PNG or WEBP · Maximum 10 MB
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_180px]">
              <label className="group flex min-h-[145px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#C8DDD3] bg-[#F5F9F6] p-5 text-center transition hover:border-[#176D68] hover:bg-[#EDF6F0]">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={selectFile}
                  disabled={busy}
                  className="hidden"
                />

                <div className="flex size-12 items-center justify-center rounded-[17px] bg-[#E4F2EF] text-[#176D68] transition group-hover:scale-105">
                  <Upload size={22} />
                </div>

                <p className="mt-3 text-sm font-extrabold text-[#20302D]">
                  {file ? "Choose another image" : "Upload a photograph"}
                </p>

                <p className="mt-1 text-xs text-[#81918B]">
                  Tap to browse your device
                </p>
              </label>

              <div className="relative min-h-[145px] overflow-hidden rounded-[24px] bg-[#F0F6F2]">
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Selected member preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[#142D29]/65 px-3 py-2 text-white backdrop-blur-md">
                      <span className="text-[10px] font-bold">
                        Image preview
                      </span>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setFile(null)}
                        className="flex size-7 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
                        aria-label="Remove selected image"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full min-h-[145px] flex-col items-center justify-center gap-2 text-[#81918B]">
                    <Camera size={25} />
                    <span className="text-xs font-semibold">
                      No image selected
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {message && (
              <Notice type="success" onClose={() => setMessage("")}>
                {message}
              </Notice>
            )}

            {failure && (
              <Notice type="error" onClose={() => setFailure("")}>
                {failure}
              </Notice>
            )}
          </AnimatePresence>

          {/* Form actions */}
          <div className="flex flex-col gap-3 border-t border-[#EDF1EE] pt-5 sm:flex-row">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={busy || !form.name.trim()}
              className="flex min-h-13 flex-1 items-center justify-center gap-2 rounded-full bg-[#176D68] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_5px_16px_rgba(23,109,104,0.18)] transition hover:bg-[#105A55] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving record...
                </>
              ) : editing ? (
                <>
                  <Save size={18} />
                  Save changes
                </>
              ) : (
                <>
                  <Plus size={19} />
                  Add member
                </>
              )}
            </motion.button>

            {editing && (
              <button
                type="button"
                disabled={busy}
                onClick={resetForm}
                className="flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#F0F6F2] px-7 py-3.5 text-sm font-bold text-[#53675F] transition hover:bg-[#E4F2EF] disabled:opacity-50"
              >
                <RotateCcw size={16} />
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Member directory */}
      <section className="space-y-6">
        <SectionHeading
          eyebrow="YOUR DIRECTORY"
          title="Registered members"
          description={`${data.length} ${data.length === 1 ? "member" : "members"} in your church directory`}
          action={
            <div className="flex size-12 items-center justify-center rounded-[18px] bg-[#E4F2EF] text-[#176D68]">
              <Users size={23} />
            </div>
          }
        />

        {/* Search */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#81918B]"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role or class..."
              className="h-13 w-full rounded-full border border-[#E5ECE8] bg-white py-3 pl-12 pr-12 text-sm font-medium text-[#20302D] outline-none transition placeholder:text-[#A0AEA7] focus:border-[#176D68] focus:ring-4 focus:ring-[#176D68]/10"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[#81918B] hover:bg-[#F0F6F2]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-full bg-[#F0F6F2] px-4 py-3 text-[#53675F]">
            <Filter size={16} />
            <span className="text-xs font-bold">
              {filteredMembers.length} results
            </span>
          </div>
        </div>

        {/* Class filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["All Classes", ...classes].map((className) => {
            const active = selectedClass === className;

            return (
              <button
                key={className}
                type="button"
                onClick={() => setSelectedClass(className)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition ${
                  active
                    ? "bg-[#176D68] text-white"
                    : "bg-[#F0F6F2] text-[#53675F] hover:bg-[#E4F2EF]"
                }`}
              >
                {className}
              </button>
            );
          })}
        </div>

        {/* Results */}
        {loading ? (
          <LoadingScreen message="Loading member directory..." />
        ) : error ? (
          <EmptyState
            title="Could not load members"
            description={error}
          />
        ) : data.length ? (
          <div className="space-y-7">
            {groupedMembers.map(({ name, members }) => (
              members.length > 0 && (
                <section key={name} className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-10 items-center justify-center rounded-[15px] ${classThemes[name].icon} ${classThemes[name].text}`}>
                        <Users size={18} />
                      </div>

                      <div>
                        <h3 className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#20302D]">
                          {name}
                        </h3>

                        <p className="text-xs font-medium text-[#81918B]">
                          {members.length} {members.length === 1 ? "member" : "members"}
                        </p>
                      </div>
                    </div>

                    <span className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${classThemes[name].surface} ${classThemes[name].text}`}>
                      {members.length}
                    </span>
                  </div>

                  <motion.div
                    layout
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                  >
                    <AnimatePresence mode="popLayout">
                      {members.map((member) => (
                        <MemberCard
                          key={member.id}
                          member={member}
                          onEdit={startEdit}
                          onDelete={remove}
                          onDownload={downloadImage}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
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
          <EmptyState
            title="No members registered"
            description="Add your first Junior Church member using the form above."
          />
        )}
      </section>
    </div>
  );
}
