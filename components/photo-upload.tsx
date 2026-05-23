"use client";

import { useState, useCallback } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";

interface PhotoUploadProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
  label?: string;
  sublabel?: string;
}

/**
 * Reusable drag-drop photo upload component.
 * Shows previews and supports multiple files.
 */
export function PhotoUpload({
  onUpload,
  maxFiles = 10,
  accept = "image/*",
  className = "",
  label = "Drop photos here or click to upload",
  sublabel = "JPG, PNG, WebP up to 10MB each",
}: PhotoUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const files = Array.from(fileList).slice(0, maxFiles);
      const newPreviews: string[] = [];

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setPreviews((prev) => [...prev, ...newPreviews].slice(0, maxFiles));
          }
        };
        reader.readAsDataURL(file);
      });

      onUpload(files);
    },
    [maxFiles, onUpload]
  );

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          dragging
            ? "border-violet-500 bg-violet-500/10"
            : "border-border/60 hover:border-violet-500/50"
        }`}
      >
        <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-xs text-muted-foreground/60 mt-1">{sublabel}</span>
        <input
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {previews.map((src, i) => (
            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden group">
              <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removePreview(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
