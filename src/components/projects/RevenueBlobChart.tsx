"use client";

import { useMemo } from "react";
import type { Project } from "@/lib/types";

function formatKzt(value: number): string {
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value)} ₸`;
}

interface RevenueBlobChartProps {
  projects: Project[];
  month: string;
}

const COLORS = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-tertiary)",
  "#3f8cff",
  "#2e7d32",
  "#ef6c00",
];

export default function RevenueBlobChart({ projects, month }: RevenueBlobChartProps) {
  const paid = useMemo(
    () => projects.filter((p) => p.paid_at?.slice(0, 7) === month && Number(p.price) > 0),
    [projects, month]
  );

  const total = paid.reduce((sum, p) => sum + Number(p.price || 0), 0);

  return (
    <section className="rounded-[var(--shape-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="md-typescale-title-large text-[var(--color-on-surface)]">Распределение</h2>
        <span className="md-typescale-title-medium text-[var(--color-on-surface-variant)]">{formatKzt(total)}</span>
      </div>
      {paid.length === 0 ? (
        <div className="rounded-[var(--shape-l)] bg-[var(--color-surface-container)] px-4 py-8 text-center md-typescale-body-medium text-[var(--color-on-surface-variant)]">
          Пока нет оплаченных проектов за этот месяц.
        </div>
      ) : (
        <div className="grid gap-3">
          {paid.slice(0, 6).map((project, index) => {
            const value = Number(project.price || 0);
            const ratio = total > 0 ? value / total : 0;
            return (
              <div key={project.id} className="rounded-[var(--shape-l)] bg-[var(--color-surface-container)] px-4 py-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <p className="truncate md-typescale-body-large text-[var(--color-on-surface)]">{project.client_name}</p>
                  </div>
                  <p className="shrink-0 md-typescale-label-large text-[var(--color-on-surface)]">{formatKzt(value)}</p>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[var(--color-surface-container-high)]">
                  <div className="h-full rounded-full" style={{ width: `${Math.max(8, ratio * 100)}%`, backgroundColor: COLORS[index % COLORS.length] }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
