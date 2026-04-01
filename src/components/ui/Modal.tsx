"use client";

import { cx } from "./primitives";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
      onClick={onClose}
    >
      <div
        className={cx(
          "w-full max-w-lg rounded-[var(--shape-xl)] border border-[var(--color-outline-variant)]",
          "bg-[var(--color-surface-container-high)] p-5 text-[var(--color-on-surface)]",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <h2 className="md-typescale-title-large mb-3">{title}</h2>
        ) : null}
        {children}
      </div>
    </div>
  );
}
