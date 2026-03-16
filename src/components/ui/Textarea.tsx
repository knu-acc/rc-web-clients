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
      <label htmlFor={id} className="block md-typescale-label-large text-[var(--color-on-surface)]">
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
          "w-full resize-y rounded-[20px] border bg-[var(--color-surface)] px-4 py-3 md-typescale-body-large text-[var(--color-on-surface)]",
          "placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30",
          error
            ? "border-[var(--color-error)]"
            : "border-[var(--color-outline)] hover:border-[var(--color-on-surface)]",
        ].join(" ")}
      />
      {hint && !error ? (
        <p id={`${id}-hint`} className="md-typescale-body-small text-[var(--color-on-surface-variant)]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="md-typescale-body-small text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
