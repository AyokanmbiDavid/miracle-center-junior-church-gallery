import React, { useState, useEffect } from "react";
import { X, CalendarBlank, Clock, BabyIcon } from "@phosphor-icons/react";
import ImageDropzone from "./ImageDropZone.jsx";
import { Loader2 } from "lucide-react";

export default function StatusEditModal({ isOpen, onClose, initialData = null, onSave }) {
  const [formData, setFormData] = useState({ title: "", isNewSunday: true, imageFile: null, className: ''});
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ title: initialData.title || initialData.name || "", isNewSunday: initialData.isNewSunday ?? true, imageFile: null, className: initialData.className });
      setExistingImageUrl(initialData.src || "");
    } else {
      setFormData({ title: "", isNewSunday: true, imageFile: null, className:'Toddler' });
      setExistingImageUrl("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const submitData = new FormData();
    submitData.append("title", formData.title || "Sunday Update");
    submitData.append("className", formData.className)
    submitData.append("isNewSunday", formData.isNewSunday);
    if (formData.imageFile) submitData.append("image", formData.imageFile);

    try {
      await onSave(initialData?._id || null, submitData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 dark:bg-black/60 p-4 backdrop-blur-xs duration-150">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl shadow-xl text-stone-800 dark:text-zinc-100 animate-in fade-in zoom-in-95">
        <div className="flex p-3 justify-between items-center mb-5 border-b border-stone-300 dark:border-zinc-800 pb-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 flex items-center gap-1.5"><CalendarBlank size={18} weight="duotone" /> {initialData ? "Modify Broadcast Status" : "Create Sunday Broadcast"}</h2>
          <button onClick={onClose} type="button" className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-zinc-300 cursor-pointer"><X size={16} weight="bold" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2 text-xs font-medium">
          <ImageDropzone value={formData.imageFile} onChange={(file) => setFormData((prev) => ({ ...prev, imageFile: file }))} previewUrl={existingImageUrl} onClearPreview={() => setExistingImageUrl("")} />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-stone-500 dark:text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Broadcast Title</label>
            <div className="relative flex items-center">
              <CalendarBlank size={14} className="absolute left-3 text-stone-400" />
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full pl-9 p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-full text-stone-800 dark:text-zinc-100 focus:outline-none" placeholder="e.g. Service Highlights" />
            </div>
          </div>

          {/* class */}
          <div className="flex flex-col gap-2">
            <label className="text-stone-500 dark:text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Class Status</label>
            {/* select */}
            <div className="relative flex items-center">
              <BabyIcon size={14} className="absolute left-3 text-stone-400" />
               <select name="" id=""
            onChange={(e) => setFormData({...formData, className: e.target.value })}
            className="w-full pl-9 p-3 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-full text-stone-800 dark:text-zinc-100 focus:outline-none">
              {['Toddlers', 'Children', 'Pre-teens', 'Teenagers'].map(item => (
                <option className="w-full ">{item}</option>
              ))}
            </select>
            </div>
           
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-stone-500 dark:text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Broadcast Tier</label>
            <div className="w-full p-1 bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-full">
              <nav className="flex gap-1">
                {[{ name: "Active Sunday", set: true }, { name: "Archived Broadcast", set: false }].map((tab) => (
                  <button type="button" key={String(tab.set)} onClick={() => setFormData({ ...formData, isNewSunday: tab.set })} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-sans font-semibold rounded-full border transition-all cursor-pointer ${formData.isNewSunday === tab.set ? "bg-white dark:bg-zinc-800 text-amber-700 dark:text-amber-400 border-stone-200 dark:border-zinc-700 shadow-xs" : "text-stone-500 dark:text-zinc-400 border-transparent hover:text-stone-800"}`}>
                    <Clock size={14} weight={formData.isNewSunday === tab.set ? "fill" : "regular"} /> {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-stone-100 dark:border-zinc-800">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2.5 text-xs font-mono bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 text-stone-600 rounded-full cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-mono font-bold cursor-pointer disabled:bg-stone-400">{loading ? <><span className="flex gap-2 items-center">Publishing...<Loader2 className="animate-spin" size={12} /></span></> : "Save Broadcast"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
