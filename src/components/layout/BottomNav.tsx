"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const isProjects = pathname?.startsWith("/projects") ?? false;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-center h-20 bg-[var(--color-surface-container)] border-t border-[var(--color-outline-variant)] safe-area-inset-bottom"
      aria-label="Основная навигация"
    >
      <Link
        href="/projects"
        className="flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[48px] px-4"
        aria-current={isProjects ? "page" : undefined}
      >
        <div className={`flex items-center justify-center w-16 h-8 rounded-full transition-colors ${
          isProjects
            ? "bg-[var(--color-secondary-container)]"
            : "bg-transparent"
        }`}>
          <svg
            className={`w-6 h-6 ${isProjects ? "text-[var(--color-on-secondary-container)]" : "text-[var(--color-on-surface-variant)]"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <span className={`md-typescale-label-medium ${
          isProjects
            ? "text-[var(--color-on-surface)] font-bold"
            : "text-[var(--color-on-surface-variant)]"
        }`}>
          Проекты
        </span>
      </Link>
    </nav>
  );
}
