import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, UploadSimple, Image as ImageIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";

// Import API Controller Functions
import {
  createMember,
  updateMember,
  createStatus,
  updateStatus,
  createThrowback,
  updateThrowback,
} from "../../../axioscontroller";

const EditModal = ({ isOpen, onClose, initialData, type = "member", onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    className: "Toddlers",
    role: "Member",
    description: "",
    isNewSunday: true,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || initialData.title || "",
        className: initialData.class || initialData.className || "Toddlers",
        role: initialData.role || "Member",
        description: initialData.description || "",
        isNewSunday: initialData.isNewSunday ?? true,
      });
      setPreview(initialData.image || initialData.imageUrl || initialData.src || "");
      setSelectedFile(null);
    } else {
      setFormData({
        name: "",
        className: "Toddlers",
        role: "Member",
        description: "",
        isNewSunday: true,
      });
      setPreview("");
      setSelectedFile(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      toast.error("Please upload a valid image file");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();

    if (type === "member") {
      payload.append("name", formData.name);
      payload.append("className", formData.className);
      payload.append("role", formData.role);
    } else if (type === "status") {
      payload.append("isNewSunday", formData.isNewSunday);
    } else if (type === "throwback") {
      payload.append("description", formData.description);
    }

    if (selectedFile) {
      payload.append("image", selectedFile);
    }

    const toastId = toast.loading(
      initialData ? `Updating ${type}...` : `Creating ${type}...`
    );

    try {
      let response;
      const isEdit = Boolean(initialData?._id);

      // Map action to specific controller function
      if (type === "member") {
        response = isEdit
          ? await updateMember(initialData._id, payload)
          : await createMember(payload);
      } else if (type === "status") {
        response = isEdit
          ? await updateStatus(initialData._id, payload)
          : await createStatus(payload);
      } else if (type === "throwback") {
        response = isEdit
          ? await updateThrowback(initialData._id, payload)
          : await createThrowback(payload);
      }

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} ${
          isEdit ? "updated" : "created"
        } successfully!`,
        { id: toastId }
      );

      if (onSuccess) onSuccess(response);
      onClose();
    } catch (err) {
      toast.error(err?.message || `Failed to save ${type}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full sm:max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto"
        >
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6 sm:hidden" />

          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-base font-bold text-gray-900 dark:text-white capitalize">
              {initialData ? `Edit ${type}` : `Add New ${type}`}
            </h2>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-full h-48 rounded-xl overflow-hidden border-2 border-dashed transition-all cursor-pointer group flex flex-col items-center justify-center ${
                isDragging
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-[0.99]"
                  : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                    <ImageIcon size={28} />
                    <span className="text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/30">
                      Change Image
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-500 dark:text-gray-400 gap-2 p-4 text-center">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                    <UploadSimple size={24} className="text-blue-500" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Click to upload or drag & drop
                    </span>
                    <span className="text-[10px] text-gray-400">
                      PNG, JPG, or WEBP (Max 10MB)
                    </span>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {type === "member" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Class</label>
                    <select
                      value={formData.className}
                      onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Toddlers">Toddlers</option>
                      <option value="Children">Children</option>
                      <option value="Pre-teens">Pre-teens</option>
                      <option value="Teenagers">Teenagers</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Member">Member</option>
                      <option value="Teacher">Teacher</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {type === "status" && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <input
                  type="checkbox"
                  id="isNewSunday"
                  checked={formData.isNewSunday}
                  onChange={(e) => setFormData({ ...formData, isNewSunday: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="isNewSunday" className="text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                  Mark as "New Sunday" Update
                </label>
              </div>
            )}

            {type === "throwback" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Description / Tag</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="Describe this throwback memory..."
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Check size={16} /> {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditModal;