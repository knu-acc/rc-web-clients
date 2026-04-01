"use client";

import { WORK_STATUS_OPTIONS } from "@/lib/constants";
import type { WorkStatus } from "@/lib/types";
import { hapticLight } from "@/lib/haptics";

interface ProjectFiltersProps {
  value: WorkStatus | "all";
  onChange: (value: WorkStatus | "all") => void;
}

export default function ProjectFilters({ value, onChange }: ProjectFiltersProps) {
  const allOptions = [{ value: "all" as const, label: "Все" }, ...WORK_STATUS_OPTIONS];

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-hide" role="group" aria-label="Фильтр по статусу">
      {allOptions.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              hapticLight();
              onChange(opt.value as WorkStatus | "all");
            }}
            className={[
              "shrink-0 rounded-[var(--sys-shape-full)] px-4 py-2 md-typescale-label-large transition-colors",
              active
                ? "bg-[var(--sys-color-role-secondary-container)] text-[var(--sys-color-role-on-secondary-container)]"
                : "bg-[var(--sys-color-role-surface-container-high)] text-[var(--sys-color-role-on-surface-variant)] hover:bg-[var(--sys-color-role-surface-container-highest)]",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
