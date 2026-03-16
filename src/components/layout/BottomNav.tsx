"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const isProjects = pathname?.startsWith("/projects") ?? false;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--color-outline-variant)] bg-[color-mix(in_srgb,var(--color-surface-container)_92%,transparent)] backdrop-blur-xl"
      aria-label="Основная навигация"
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-center px-4 pb-[max(env(safe-area-inset-bottom),0px)]">
        <Link
          href="/projects"
          className="flex min-w-[104px] flex-col items-center justify-center gap-1 rounded-[20px] px-4 py-2"
          aria-current={isProjects ? "page" : undefined}
        >
          <div
            className={[
              "flex h-8 min-w-16 items-center justify-center rounded-full px-5 transition-colors",
              isProjects
                ? "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]"
                : "text-[var(--color-on-surface-variant)]",
            ].join(" ")}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <span
            className={[
              "md-typescale-label-medium",
              isProjects
                ? "text-[var(--color-on-surface)]"
                : "text-[var(--color-on-surface-variant)]",
            ].join(" ")}
          >
            Проекты
          </span>
        </Link>
      </div>
    </nav>
  );
}
