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

  if (!paid.length || total <= 0) {
    return (
      <section className="rounded-[28px] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-5">
        <h2 className="md-typescale-title-large text-[var(--color-on-surface)]">Доход по проектам</h2>
      </section>
    );
  }

  let offset = 0;
  const rings = paid.slice(0, 6).map((project, index) => {
    const value = Number(project.price || 0);
    const ratio = value / total;
    const radius = 34 + ratio * 86;
    const item = {
      name: project.client_name,
      value,
      radius,
      color: COLORS[index % COLORS.length],
      x: 150 + Math.cos(index * 1.05 - 1.2) * (offset + 12),
      y: 138 + Math.sin(index * 1.05 - 1.2) * (offset * 0.58),
    };
    offset += 26;
    return item;
  });

  return (
    <section className="rounded-[28px] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="md-typescale-title-large text-[var(--color-on-surface)]">Доход по проектам</h2>
        <span className="md-typescale-title-medium text-[var(--color-on-surface-variant)]">{formatKzt(total)}</span>
      </div>
      <div className="grid gap-5 lg:grid-cols-[340px_1fr] lg:items-center">
        <div className="mx-auto w-full max-w-[340px]">
          <svg viewBox="0 0 300 300" className="h-auto w-full" aria-label="Круги дохода по проектам">
            <defs>
              <radialGradient id="surfaceGlow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="var(--color-primary-container)" stopOpacity="0.95" />
                <stop offset="100%" stopColor="var(--color-surface-container-high)" stopOpacity="0.35" />
              </radialGradient>
            </defs>
            <circle cx="150" cy="150" r="116" fill="url(#surfaceGlow)" />
            {rings.map((ring, index) => (
              <g key={`${ring.name}-${index}`}>
                <circle cx={ring.x} cy={ring.y} r={ring.radius} fill={ring.color} opacity="0.18" />
                <circle cx={ring.x} cy={ring.y} r={Math.max(26, ring.radius - 10)} fill={ring.color} opacity="0.9" />
                <text x={ring.x} y={ring.y - 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
                  {trimLabel(ring.name)}
                </text>
                <text x={ring.x} y={ring.y + 14} textAnchor="middle" fill="white" fontSize="10" opacity="0.92">
                  {formatCompact(ring.value)}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="grid gap-3">
          {rings.map((ring, index) => (
            <div key={`${ring.name}-${index}`} className="flex items-center justify-between gap-3 rounded-[20px] bg-[var(--color-surface-container)] px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: ring.color }} />
                <p className="truncate md-typescale-body-large text-[var(--color-on-surface)]">{ring.name}</p>
              </div>
              <p className="shrink-0 md-typescale-label-large text-[var(--color-on-surface)]">{formatKzt(ring.value)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function trimLabel(value: string) {
  return value.length > 10 ? `${value.slice(0, 9)}…` : value;
}

function formatCompact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}м`;
  if (value >= 1_000) return `${Math.round(value / 1000)}к`;
  return String(Math.round(value));
}
