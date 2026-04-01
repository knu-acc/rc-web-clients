"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProjects = pathname?.startsWith("/projects") ?? false;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--sys-color-role-outline-variant)] bg-[var(--sys-surface-backdrop)] backdrop-blur-xl" aria-label="Основная навигация">
      <div className="mx-auto grid h-20 max-w-6xl grid-cols-2 items-center px-4 pb-[max(env(safe-area-inset-bottom),0px)]">
        <NavItem href="/" active={isHome} label="Главная" iconPath="M3 10.75 12 3l9 7.75V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1z" />
        <NavItem href="/projects" active={isProjects} label="Проекты" iconPath="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </div>
    </nav>
  );
}

function NavItem({ href, active, label, iconPath }: { href: string; active: boolean; label: string; iconPath: string }) {
  return (
    <Link href={href} className="flex min-w-[104px] flex-col items-center justify-center gap-1 rounded-[var(--sys-shape-4)] px-4 py-2" aria-current={active ? "page" : undefined}>
      <div className={["flex h-8 min-w-16 items-center justify-center rounded-[var(--sys-shape-full)] px-5 transition-colors", active ? "bg-[var(--sys-color-role-secondary-container)] text-[var(--sys-color-role-on-secondary-container)]" : "text-[var(--sys-color-role-on-surface-variant)]"].join(" ")}>
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
      </div>
      <span className={["md-typescale-label-medium", active ? "text-[var(--sys-color-role-on-surface)]" : "text-[var(--sys-color-role-on-surface-variant)]"].join(" ")}>{label}</span>
    </Link>
  );
}
