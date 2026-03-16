"use client";

export default function BlobDecoration() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute -right-24 top-[-56px] h-[320px] w-[320px] opacity-70 blur-2xl" style={{ background: "radial-gradient(circle at center, color-mix(in srgb, var(--color-primary-container) 88%, white) 0%, transparent 72%)" }} />
      <div className="absolute left-[-80px] top-[28%] h-[260px] w-[260px] opacity-60 blur-2xl" style={{ background: "radial-gradient(circle at center, color-mix(in srgb, var(--color-tertiary-container) 78%, white) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[96px] right-[8%] h-[220px] w-[220px] opacity-55 blur-2xl" style={{ background: "radial-gradient(circle at center, color-mix(in srgb, var(--color-secondary-container) 72%, white) 0%, transparent 68%)" }} />
    </div>
  );
}
