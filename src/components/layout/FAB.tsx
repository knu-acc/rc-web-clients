"use client";

import Link from "next/link";

export default function FAB() {
  return (
    <Link
      href="/projects/new"
      className="fixed bottom-24 right-4 z-30 flex min-h-14 min-w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-container)] px-4 text-[var(--color-on-primary-container)] shadow-[0_6px_18px_rgba(103,80,164,0.24)] transition-transform hover:-translate-y-0.5 md:right-6"
      aria-label="Добавить проект"
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </Link>
  );
}
