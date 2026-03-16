"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";

function formatKzt(value: number): string {
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value)} ₸`;
}

function getProjectLabel(project: Project): string {
  if (project.website_url) {
    try {
      const host = new URL(project.website_url).hostname.replace("www.", "");
      return host;
    } catch {
      return project.website_url;
    }
  }
  return project.client_name;
}

/**
 * Fluent / organic shape: круглый круг, но граница — синусоида (волна по радиусу).
 * r(θ) = R + A·sin(n·θ), одна гармоника — плавная «вырезка» по краю.
 */
function organicRadius(angle: number, baseR: number): number {
  const waves = 6;
  const amplitude = 0.06;
  return baseR * (1 + amplitude * Math.sin(waves * angle));
}

function organicPoint(angle: number, baseR: number, cx: number, cy: number) {
  const r = organicRadius(angle, baseR);
  return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) };
}

const PALETTE = [
  "#1976D2", "#7B1FA2", "#C2185B", "#00838F", "#558B2F", "#F9A825", "#E64A19", "#5D4037",
];

interface RevenueBlobChartProps {
  projects: Project[];
  month: string;
}

export default function RevenueBlobChart({ projects, month }: RevenueBlobChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const paidInMonth = useMemo(
    () => projects.filter((p) => p.paid_at?.slice(0, 7) === month && Number(p.price) > 0),
    [projects, month]
  );

  const { labels, values, total, segments, cx, cy, baseR } = useMemo(() => {
    const labels = paidInMonth.map(getProjectLabel);
    const values = paidInMonth.map((p) => Number(p.price) || 0);
    const total = values.reduce((s, v) => s + v, 0);
    const cx = 120;
    const cy = 120;
    const baseR = 95;
    const segments: { startAngle: number; endAngle: number; color: string; label: string; value: number }[] = [];
    let acc = 0;
    for (let i = 0; i < values.length; i++) {
      const span = total > 0 ? (values[i] / total) * 2 * Math.PI : 0;
      segments.push({
        startAngle: acc,
        endAngle: acc + span,
        color: PALETTE[i % PALETTE.length],
        label: labels[i],
        value: values[i],
      });
      acc += span;
    }
    return { labels, values, total, segments, cx, cy, baseR };
  }, [paidInMonth]);

  if (!paidInMonth.length) {
    return (
      <div className="rounded-[16px] p-4 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/50">
        <h3 className="md-typescale-title-medium text-[var(--color-on-surface)] mb-2">Доход по сайтам</h3>
        <p className="md-typescale-body-medium text-[var(--color-on-surface-variant)]">В этом месяце нет оплаченных проектов.</p>
      </div>
    );
  }

  const pathForSegment = (start: number, end: number) => {
    const pts: { x: number; y: number }[] = [];
    const steps = Math.max(12, Math.ceil((end - start) * 24));
    for (let i = 0; i <= steps; i++) {
      const a = start + (end - start) * (i / steps);
      pts.push(organicPoint(a, baseR, cx, cy));
    }
    const startPt = organicPoint(start, baseR, cx, cy);
    let d = `M ${cx} ${cy}`;
    d += ` L ${startPt.x} ${startPt.y}`;
    pts.forEach((p, i) => {
      if (i === 0) return;
      d += ` L ${p.x} ${p.y}`;
    });
    d += ` Z`;
    return d;
  };

  return (
    <div className="rounded-[16px] p-4 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="md-typescale-title-medium text-[var(--color-on-surface)]">Доход по сайтам</h3>
        <span className="md-typescale-label-large text-[var(--color-on-surface-variant)]">{formatKzt(total)}</span>
      </div>
      <div className="max-w-[280px] mx-auto">
        <svg viewBox="0 0 240 240" className="w-full h-auto" aria-label="Круговая диаграмма дохода">
          {segments.map((seg, i) => (
            <path
              key={i}
              d={pathForSegment(seg.startAngle, seg.endAngle)}
              fill={seg.color}
              opacity={hoverIndex === null ? 1 : hoverIndex === i ? 1 : 0.45}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              className="transition-opacity duration-200"
            />
          ))}
        </svg>
      </div>
      <ul className="mt-3 space-y-1 md-typescale-body-small text-[var(--color-on-surface-variant)]">
        {segments.map((seg, i) => (
          <li key={i} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ background: seg.color }}
              aria-hidden
            />
            <span className="truncate">{seg.label}</span>
            <span className="shrink-0 md-typescale-label-medium text-[var(--color-on-surface)]">{formatKzt(seg.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
