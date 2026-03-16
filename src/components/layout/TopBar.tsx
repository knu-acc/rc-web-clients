"use client";

import ThemeToggle from "./ThemeToggle";

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-[var(--color-surface-container)] border-b border-[var(--color-outline-variant)]">
      <h1 className="md-typescale-title-large text-[var(--color-on-surface)] truncate">
        {title}
      </h1>
      <ThemeToggle />
    </header>
  );
}
