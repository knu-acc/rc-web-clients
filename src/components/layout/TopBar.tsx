"use client";

import Card from "@/components/ui/Card";
import ThemeToggle from "./ThemeToggle";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-outline-variant)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] backdrop-blur-xl">
      <Card className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 rounded-none border-0 bg-transparent px-4 py-3 md:px-6">
        <div className="min-w-0 space-y-0.5">
          <p className="md-typescale-title-large truncate text-[var(--color-on-surface)]">
            {title}
          </p>
          {subtitle ? (
            <p className="md-typescale-body-small truncate text-[var(--color-on-surface-variant)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        <ThemeToggle />
      </Card>
    </header>
  );
}
