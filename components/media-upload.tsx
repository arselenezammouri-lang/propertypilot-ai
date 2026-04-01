"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Video, X, Upload, FileImage } from "lucide-react";

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}

interface MediaUploadProps {
  files: MediaFile[];
  onChange: (files: MediaFile[]) => void;
  maxFiles?: number;
  acceptImages?: boolean;
  acceptVideos?: boolean;
  label?: string;
  description?: string;
}

export type { MediaFile };

export function MediaUpload({
  files,
  onChange,
  maxFiles = 10,
  acceptImages = true,
  acceptVideos = true,
  label,
  description,
}: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function getAcceptString(): string {
    const types: string[] = [];
    if (acceptImages) types.push("image/jpeg", "image/png", "image/webp", "image/heic");
    if (acceptVideos) types.push("video/mp4", "video/quicktime", "video/webm");
    return types.join(",");
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;

    const remaining = maxFiles - files.length;
    if (remaining <= 0) return;

    const newFiles: MediaFile[] = [];
    const toProcess = Array.from(fileList).slice(0, remaining);

    for (const file of toProcess) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if ((!isImage && !isVideo) || (isImage && !acceptImages) || (isVideo && !acceptVideos)) {
        continue;
      }

      // Max 50MB per file
      if (file.size > 50 * 1024 * 1024) continue;

      const preview = URL.createObjectURL(file);
      newFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview,
        type: isImage ? "image" : "video",
      });
    }

    onChange([...files, ...newFiles]);
  }

  function removeFile(id: string) {
    const file = files.find((f) => f.id === id);
    if (file) URL.revokeObjectURL(file.preview);
    onChange(files.filter((f) => f.id !== id));
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  const canAddMore = files.length < maxFiles;

  return (
    <div className="space-y-3">
      {label && (
        <div>
          <p className="text-sm font-medium">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      )}

      {/* Preview grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted group"
            >
              {file.type === "image" ? (
                <img
                  src={file.preview}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Video className="w-8 h-8 text-muted-foreground" />
                  <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                    {file.file.name.split(".").pop()?.toUpperCase()}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {file.type === "image" && (
                <div className="absolute bottom-1 right-1">
                  <FileImage className="w-3.5 h-3.5 text-white drop-shadow" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40 hover:bg-muted/30"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={getAcceptString()}
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Upload className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {isDragging ? "Drop files here" : "Upload photos & videos"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {acceptImages && acceptVideos
                  ? "JPG, PNG, WebP, MP4, MOV"
                  : acceptImages
                  ? "JPG, PNG, WebP"
                  : "MP4, MOV, WebM"}{" "}
                — max {maxFiles} files, 50MB each
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {files.length}/{maxFiles} uploaded
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
