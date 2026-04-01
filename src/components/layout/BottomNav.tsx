"use client";

import { usePathname } from "next/navigation";
import NavigationItem from "@/components/ui/NavigationItem";

export default function BottomNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProjects = pathname?.startsWith("/projects") ?? false;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--color-outline-variant)] bg-[color-mix(in_srgb,var(--color-surface-container)_92%,transparent)] backdrop-blur-xl"
      aria-label="Основная навигация"
    >
      <div className="mx-auto grid h-20 max-w-6xl grid-cols-2 items-center px-4 pb-[max(env(safe-area-inset-bottom),0px)]">
        <NavigationItem
          href="/"
          active={isHome}
          label="Главная"
          iconPath="M3 10.75 12 3l9 7.75V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1z"
        />
        <NavigationItem
          href="/projects"
          active={isProjects}
          label="Проекты"
          iconPath="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </div>
    </nav>
  );
}
