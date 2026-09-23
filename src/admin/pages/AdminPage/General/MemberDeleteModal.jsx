import React, { useState } from "react";
import { Warning } from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";

export default function MemberDeleteModal({ isOpen, onClose, onConfirm, memberName }) {
  if (!isOpen) return null;
  const [loading,setloading] = useState(false)

  async function ondel () {
    setloading(true)
    try{
      await onConfirm()
    } catch (err) {

    }
    setloading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl p-6 text-center border border-gray-200 dark:border-gray-800">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Warning size={28} weight="bold" />
        </div>
        <h3 className="text-sm font-semibold">Delete Member</h3>
        <p className="text-xs text-gray-500 mt-2">
          Are you sure you want to remove <span className="font-semibold text-gray-900 dark:text-white">"{memberName || "this member"}"</span>?
        </p>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={() => ondel()}
            className="flex justify-center py-2 px-4 text-xs bg-red-600 border-2 border-red-400 shadow-md text-white rounded-xl"
          >
            {loading ? <><span className="flex gap-2 items-center">Deleting (takes up to 5sec+ cus of drive api) <Loader2 className="animate-spin"/></span></>: 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}