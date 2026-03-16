"use client";

import { WORK_STATUS_OPTIONS } from "@/lib/constants";
import type { WorkStatus } from "@/lib/types";

interface ProjectFiltersProps {
  value: WorkStatus | "all";
  onChange: (value: WorkStatus | "all") => void;
}

export default function ProjectFilters({ value, onChange }: ProjectFiltersProps) {
  const allOptions = [
    { value: "all" as const, label: "Все" },
    ...WORK_STATUS_OPTIONS,
  ];

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
      role="group"
      aria-label="Фильтр по статусу"
    >
      {allOptions.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value as WorkStatus | "all")}
          className={[
            "shrink-0 px-4 h-8 rounded-[8px] md-typescale-label-large inline-flex items-center transition-colors",
            value === opt.value
              ? "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]"
              : "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-highest)]",
          ].join(" ")}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
