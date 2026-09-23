import React, { useState, useRef } from "react";
import { UploadSimple, X } from "@phosphor-icons/react";

export default function ImageDropzone({ value, onChange, previewUrl, onClearPreview }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // 1. Drag & Drop Event Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  // 2. Click to Select File
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  // Determine whether to show local uploaded file or remote URL
  const displaySrc = value ? URL.createObjectURL(value) : previewUrl;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${
        isDragging
          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
          : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:border-gray-300"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {displaySrc ? (
        <div className="relative w-full h-full group">
          <img src={displaySrc} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <span className="text-xs text-white bg-black/60 px-3 py-1.5 rounded-lg">
              Change Image
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                if (onClearPreview) onClearPreview();
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-400">
          <UploadSimple size={24} className="mb-1 text-blue-500" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Click to upload or drag & drop
          </span>
          <span className="text-[10px] mt-1">Supports PNG, JPG, WEBP</span>
        </div>
      )}
    </div>
  );
}