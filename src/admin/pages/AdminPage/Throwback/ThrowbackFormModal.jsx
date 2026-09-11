import React, { useState, useEffect } from "react";
import { X, ArchiveBoxIcon, NoteBlank } from "@phosphor-icons/react";
import ImageDropzone from "./ImageDropZone.jsx";
import { Loader2 } from "lucide-react";

export default function ThrowbackFormModal({ isOpen, onClose, initialData = null, onSave }) {
  const [formData, setFormData] = useState({
    description: "",
    imageFile: null,
  });
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description || "",
        imageFile: null,
      });
      setExistingImageUrl(initialData.src || "");
    } else {
      setFormData({ description: "", imageFile: null });
      setExistingImageUrl("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append("description", formData.description);

    if (formData.imageFile) {
      submitData.append("image", formData.imageFile);
    }

    try {
      const throwbackId = initialData ? initialData._id || initialData.id : null;
      await onSave(throwbackId, submitData);
      onClose();
    } catch (err) {
      console.error("Error processing throwback submission:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 dark:bg-black/60 backdrop-blur-xs p-4 transition-colors duration-300">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl p-5 shadow-xl text-stone-800 dark:text-zinc-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Supabase Clean Modal Header */}
        <div className="flex justify-between items-center mb-5 border-b border-stone-100 dark:border-zinc-800 pb-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 flex items-center gap-1.5">
            <ArchiveBoxIcon size={18} weight="duotone" />
            {initialData ? "Modify Archive Memory" : "Archive Historical Memory"}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="p-1 text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-300 rounded-md transition-colors cursor-pointer"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs font-medium">
          <ImageDropzone
            value={formData.imageFile}
            onChange={(file) => setFormData((prev) => ({ ...prev, imageFile: file }))}
            previewUrl={existingImageUrl}
            onClearPreview={() => setExistingImageUrl("")}
          />

          {/* Description Input Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-stone-500 dark:text-zinc-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
              <NoteBlank size={12} /> Description / Caption
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-2.5 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-lg text-stone-800 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-600 focus:outline-none focus:border-amber-600 dark:focus:border-amber-500 font-sans resize-none"
              placeholder="Describe this throwback sanctuary memory..."
              required
            />
          </div>

          {/* Form Action Row Layout */}
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-stone-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-mono font-medium bg-stone-100 hover:bg-stone-200 dark:bg-zinc-950 dark:hover:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-zinc-400 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded-lg font-mono font-bold shadow-md shadow-amber-700/10 transition-colors cursor-pointer disabled:bg-stone-400 dark:disabled:bg-zinc-800"
            >
              {loading ? (
                <>
                  <span>Archiving...</span>
                  <Loader2 className="animate-spin" size={12} />
                </>
              ) : (
                "Save Throwback"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
