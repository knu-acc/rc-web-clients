"use client";

import { useId } from "react";

interface TextareaProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
  error?: string;
}

export default function Textarea({
  label,
  value = "",
  onChange,
  placeholder,
  hint,
  rows = 5,
  error,
}: TextareaProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block md-typescale-label-large text-[var(--sys-input-fg)]">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        aria-describedby={describedBy}
        className={[
          "w-full resize-y rounded-[var(--sys-input-radius)] border bg-[var(--sys-input-bg)] px-4 py-3 md-typescale-body-large text-[var(--sys-input-fg)]",
          "placeholder:text-[var(--sys-input-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--sys-input-focus-ring)]",
          error
            ? "border-[var(--sys-input-border-error)]"
            : "border-[var(--sys-input-border)] hover:border-[var(--sys-input-border-hover)]",
        ].join(" ")}
      />
      {hint && !error ? (
        <p id={`${id}-hint`} className="md-typescale-body-small text-[var(--sys-color-role-on-surface-variant)]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="md-typescale-body-small text-[var(--sys-color-role-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
