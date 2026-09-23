import React from 'react';
import { Warning, Trash, X } from '@phosphor-icons/react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemTitle }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 dark:bg-black/60 backdrop-blur-xs p-4 transition-all duration-300">
      <div className="w-full max-w-xs bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 text-stone-800 dark:text-zinc-100">
        <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center mx-auto mb-4 border border-red-500/20">
          <Warning size={22} weight="regular" />
        </div>
        <h3 className="text-sm font-bold tracking-tight">Purge Broadcast Entry</h3>
        <p className="text-xs text-stone-500 dark:text-zinc-400 mt-2 font-medium leading-relaxed">
          Are you absolute certain you want to remove <span className="font-mono font-bold text-stone-700 dark:text-zinc-200 bg-stone-100 dark:bg-zinc-950 px-1 py-0.5 rounded border border-stone-200 dark:border-zinc-800">"{itemTitle || "this broadcast"}"</span>?
        </p>
        <div className="flex gap-2 mt-6">
          <button type="button" onClick={onClose} className="flex-1 py-2 text-xs font-mono font-medium bg-stone-50 hover:bg-stone-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 text-stone-600 rounded-lg border border-stone-200 cursor-pointer">Cancel</button>
          <button type="button" onClick={onConfirm} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-mono font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer shadow-sm"><Trash size={14} /> Confirm</button>
        </div>
      </div>
    </div>
  );
}
