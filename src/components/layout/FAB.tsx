"use client";

import Link from "next/link";
import { useStateLayerRipple } from "@/lib/motion";

export default function FAB() {
  const onRipple = useStateLayerRipple();

  return (
    <Link
      href="/projects/new"
      className="m3-interactive fixed bottom-24 right-4 z-30 flex min-h-14 min-w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-container)] px-4 text-[var(--color-on-primary-container)] shadow-[0_6px_18px_rgba(103,80,164,0.24)] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/35 md:right-6" onPointerDown={onRipple}
      aria-label="Добавить проект"
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </Link>
  );
}
