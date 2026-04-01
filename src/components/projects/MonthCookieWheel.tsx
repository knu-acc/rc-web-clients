"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { hapticLight, hapticSelection } from "@/lib/haptics";
import { usePrefersReducedMotion } from "@/lib/motion";

const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

interface MonthCookieWheelProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MonthCookieWheel({ value, onChange }: MonthCookieWheelProps) {
  const monthIndex = Number(value.slice(5, 7)) - 1;
  const year = Number(value.slice(0, 4));
  const [rotation, setRotation] = useState(-monthIndex * 30);
  const prefersReducedMotion = usePrefersReducedMotion();
  const startRef = useRef<{ angle: number; rotation: number; month: number } | null>(null);

  useEffect(() => {
    setRotation(-monthIndex * 30);
  }, [monthIndex]);

  const segments = useMemo(() => {
    return MONTHS.map((label, index) => {
      const angle = index * 30 - 90;
      const rad = (angle * Math.PI) / 180;
      return {
        label,
        index,
        x: 150 + Math.cos(rad) * 104,
        y: 150 + Math.sin(rad) * 104,
      };
    });
  }, []);

  const updateFromRotation = (nextRotation: number, withHaptic = false) => {
    const snappedIndex = mod(Math.round(-nextRotation / 30), 12);
    if (snappedIndex !== monthIndex) {
      onChange(`${year}-${String(snappedIndex + 1).padStart(2, "0")}`);
      if (withHaptic) hapticSelection();
    } else if (withHaptic) {
      hapticLight();
    }
    setRotation(-snappedIndex * 30);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(event.clientY - cy, event.clientX - cx) * (180 / Math.PI);
    startRef.current = { angle, rotation, month: monthIndex };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!startRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(event.clientY - cy, event.clientX - cx) * (180 / Math.PI);
    const delta = angle - startRef.current.angle;
    if (prefersReducedMotion) return;
    setRotation(startRef.current.rotation + delta);
  };

  const onPointerUp = () => {
    if (!startRef.current) return;
    const nextRotation = prefersReducedMotion ? -monthIndex * 30 : rotation;
    updateFromRotation(nextRotation, true);
    startRef.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative h-[300px] w-[300px] touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <svg viewBox="0 0 300 300" className="h-full w-full drop-shadow-[0_18px_40px_rgba(103,80,164,0.24)]">
          <g transform={`rotate(${rotation} 150 150)`}>
            <polygon
              points={polygonPoints(150, 150, 132, 12)}
              fill="var(--color-primary-container)"
              stroke="color-mix(in srgb, var(--color-primary) 32%, transparent)"
              strokeWidth="2"
            />
            <polygon
              points={polygonPoints(150, 150, 112, 12)}
              fill="var(--color-surface-container-low)"
              stroke="color-mix(in srgb, var(--color-primary) 18%, transparent)"
              strokeWidth="1.5"
            />
            {segments.map((segment) => (
              <g key={segment.label}>
                <text
                  x={segment.x}
                  y={segment.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={segment.index === monthIndex ? "var(--color-primary)" : "var(--color-on-surface-variant)"}
                  fontSize="13"
                  fontWeight={segment.index === monthIndex ? "700" : "500"}
                >
                  {segment.label}
                </text>
              </g>
            ))}
          </g>
          <circle cx="150" cy="150" r="54" fill="var(--color-primary)" />
          <circle cx="150" cy="150" r="44" fill="var(--color-primary-container)" />
          <text x="150" y="142" textAnchor="middle" fill="var(--color-on-primary-container)" fontSize="14" fontWeight="600">
            {MONTHS[monthIndex]}
          </text>
          <text x="150" y="160" textAnchor="middle" fill="var(--color-on-primary-container)" fontSize="12">
            {year}
          </text>
          <path d="M150 20 L158 36 L142 36 Z" fill="var(--color-tertiary)" />
        </svg>
      </div>
      <p className="md-typescale-body-small text-[var(--color-on-surface-variant)]">Поверни колесо</p>
    </div>
  );
}

function polygonPoints(cx: number, cy: number, r: number, sides: number) {
  const step = (Math.PI * 2) / sides;
  const points: string[] = [];
  for (let i = 0; i < sides; i += 1) {
    const angle = -Math.PI / 2 + step * i;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    points.push(`${x},${y}`);
  }
  return points.join(" ");
}

function mod(value: number, base: number) {
  return ((value % base) + base) % base;
}
