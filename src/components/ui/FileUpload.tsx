"use client";

import { useId, useState, useRef, type InputHTMLAttributes } from "react";
import { CONTRACT_ALLOWED_TYPES } from "@/lib/constants";

interface FileUploadProps {
  label?: string;
  value?: File | null;
  currentUrl?: string | null;
  onChange: (file: File | null, objectPath?: string) => void;
  accept?: string[];
  maxSizeMb?: number;
  error?: string;
  disabled?: boolean;
}

/**
 * Material You style file upload for contracts (PDF/images).
 * Shows current file name or link; supports drag & drop on desktop, tap on mobile.
 */
export default function FileUpload({
  label = "Договор",
  value,
  currentUrl,
  onChange,
  accept = CONTRACT_ALLOWED_TYPES,
  maxSizeMb = 10,
  error,
  disabled,
}: FileUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const maxBytes = maxSizeMb * 1024 * 1024;

  const handleFile = (file: File | null) => {
    if (!file) {
      onChange(null);
      return;
    }
    if (file.size > maxBytes) {
      return; // caller can show error via error prop
    }
    const validType = accept.some((t) => file.type === t || t.endsWith("/*"));
    if (!validType) return;
    onChange(file);
  };

  const handleChange: InputHTMLAttributes<HTMLInputElement>["onChange"] = (e) => {
    const f = e.target.files?.[0];
    handleFile(f ?? null);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    handleFile(f ?? null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(true);
  };

  const handleDragLeave = () => setDrag(false);

  const openPicker = () => inputRef.current?.click();

  const clear = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayName = value?.name ?? (currentUrl ? "Файл загружен" : null);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--sys-color-role-on-surface)] mb-1">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept.join(",")}
        onChange={handleChange}
        className="sr-only"
        disabled={disabled}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!displayName ? openPicker : undefined}
        className={[
          "min-h-[120px] rounded-[var(--sys-shape-5)] border-2 border-dashed flex flex-col items-center justify-center gap-2 p-4 cursor-pointer transition-colors",
          drag
            ? "border-[var(--sys-color-role-primary)] bg-[var(--sys-color-role-primary-container)]"
            : "border-[var(--sys-color-role-outline)] bg-[var(--sys-color-role-surface-container)] hover:border-[var(--sys-color-role-outline-variant)]",
          error && "border-[var(--sys-color-role-error)]",
          disabled && "opacity-50 cursor-not-allowed",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {displayName ? (
          <>
            <span className="text-sm text-[var(--sys-color-role-on-surface)] truncate max-w-full">
              {displayName}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); openPicker(); }}
                className="text-sm text-[var(--sys-color-role-primary)] font-medium min-h-[44px] px-3"
              >
                Заменить
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clear(); }}
                className="text-sm text-[var(--sys-color-role-error)] font-medium min-h-[44px] px-3"
              >
                Удалить
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="text-sm text-[var(--sys-color-role-on-surface-variant)]">
              Перетащите файл сюда или нажмите
            </span>
            <span className="text-xs text-[var(--sys-color-role-on-surface-variant)]">
              PDF, JPG, PNG до {maxSizeMb} МБ
            </span>
          </>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-[var(--sys-color-role-error)]">
          {error}
        </p>
      )}
    </div>
  );
}
