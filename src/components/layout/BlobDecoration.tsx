"use client";

/**
 * Декоративные blob-элементы в стиле M3 / Google — мягкие органические формы.
 * Используются как фон или акценты.
 */
export default function BlobDecoration() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden>
      <div
        className="absolute -top-24 -right-24 w-80 h-80 bg-[var(--color-primary-container)] opacity-40 animate-blob"
        style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
      />
      <div
        className="absolute top-1/3 -left-20 w-64 h-64 bg-[var(--color-tertiary-container)] opacity-30 animate-blob"
        style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
      />
      <div
        className="absolute bottom-32 right-0 w-56 h-56 bg-[var(--color-secondary-container)] opacity-25 animate-blob"
        style={{ borderRadius: "50% 50% 30% 70% / 55% 45% 55% 45%" }}
      />
    </div>
  );
}
