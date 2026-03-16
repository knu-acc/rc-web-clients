"use client";

import Link from "next/link";

export default function FAB() {
  return (
    <Link
      href="/projects/new"
      className="fixed bottom-24 right-4 z-20 w-14 h-14 min-w-[56px] min-h-[56px] rounded-[16px] bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] flex items-center justify-center hover:brightness-95 active:brightness-90 transition-all"
      aria-label="Добавить проект"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </Link>
  );
}
