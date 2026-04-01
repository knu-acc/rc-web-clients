"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/lib/types";
import { hapticLight } from "@/lib/haptics";

interface ClientCookieWheelProps {
  projects: Project[];
  onSelect?: (project: Project) => void;
}

const MAX_SEGMENTS = 12;
const COLORS = [
  "var(--sys-color-role-primary-container)",
  "var(--sys-color-role-secondary-container)",
  "var(--sys-color-role-tertiary-container)",
  "#d7e3ff",
  "#c9e6c0",
  "#ffd8c2",
];

export default function ClientCookieWheel({ projects, onSelect }: ClientCookieWheelProps) {
  const items = useMemo(() => projects.slice(0, MAX_SEGMENTS), [projects]);
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dragRef = useRef<{ angle: number; rotation: number; time: number; sector: number } | null>(null);
  const velocityRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const rotationRef = useRef(0);
  const sectorRef = useRef(0);

  useEffect(() => {
    const current = items[selectedIndex];
    if (current) onSelect?.(current);
  }, [items, onSelect, selectedIndex]);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    sectorRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  if (!items.length) {
    return (
      <div className="flex h-[344px] items-center justify-center rounded-[var(--sys-shape-xl)] bg-[var(--sys-color-role-surface-container)] text-center md-typescale-body-medium text-[var(--sys-color-role-on-surface-variant)]">
        Нет проектов для колеса.
      </div>
    );
  }

  const step = 360 / items.length;

  const sectorFromRotation = (nextRotation: number) => mod(Math.round(-nextRotation / step), items.length);

  const updateSelection = (nextRotation: number) => {
    const sector = sectorFromRotation(nextRotation);
    setSelectedIndex(sector);
    sectorRef.current = sector;
    return sector;
  };

  const startInertia = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const tick = () => {
      velocityRef.current *= 0.95;
      if (Math.abs(velocityRef.current) < 0.02) {
        const snapped = -sectorFromRotation(rotationRef.current) * step;
        rotationRef.current = snapped;
        setRotation(snapped);
        updateSelection(snapped);
        return;
      }
      const next = rotationRef.current + velocityRef.current;
      rotationRef.current = next;
      setRotation(next);
      const sector = sectorFromRotation(next);
      if (sector !== sectorRef.current) {
        setSelectedIndex(sector);
        sectorRef.current = sector;
        hapticLight();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(event.clientY - cy, event.clientX - cx) * (180 / Math.PI);
    dragRef.current = { angle, rotation: rotationRef.current, time: performance.now(), sector: sectorRef.current };
    velocityRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(event.clientY - cy, event.clientX - cx) * (180 / Math.PI);
    const delta = angle - dragRef.current.angle;
    const next = dragRef.current.rotation + delta;
    const now = performance.now();
    const dt = Math.max(16, now - dragRef.current.time);
    velocityRef.current = ((next - rotationRef.current) / dt) * 16;
    rotationRef.current = next;
    setRotation(next);
    const sector = sectorFromRotation(next);
    if (sector !== dragRef.current.sector) {
      dragRef.current.sector = sector;
      setSelectedIndex(sector);
      sectorRef.current = sector;
      hapticLight();
    }
  };

  const onPointerUp = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    startInertia();
  };

  const active = items[selectedIndex];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-[344px] w-[344px] touch-none select-none" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <svg viewBox="0 0 344 344" className="h-full w-full drop-shadow-[var(--sys-elevation-3)]">
          <g transform={`rotate(${rotation} 172 172)`}>
            <path d={roundedPolygonPath(172, 172, 146, items.length, 18)} fill="var(--sys-color-role-primary-container)" />
            <path d={roundedPolygonPath(172, 172, 124, items.length, 16)} fill="var(--sys-color-role-surface-container-low)" />
            {items.map((project, index) => {
              const angle = ((360 / items.length) * index - 90) * (Math.PI / 180);
              const x = 172 + Math.cos(angle) * 108;
              const y = 172 + Math.sin(angle) * 108;
              return (
                <g key={project.id}>
                  <circle cx={x} cy={y} r={28} fill={COLORS[index % COLORS.length]} opacity={index === selectedIndex ? 1 : 0.82} />
                  <text x={x} y={y - 3} textAnchor="middle" fill="var(--sys-color-role-on-surface)" fontSize="10" fontWeight="700">
                    {fit(project.client_name, 10)}
                  </text>
                  <text x={x} y={y + 11} textAnchor="middle" fill="var(--sys-color-role-on-surface-variant)" fontSize="9">
                    {shortPrice(project.price)}
                  </text>
                </g>
              );
            })}
          </g>
          <circle cx="172" cy="172" r="66" fill="var(--sys-color-role-primary)" />
          <circle cx="172" cy="172" r="56" fill="var(--sys-color-role-primary-container)" />
          <text x="172" y="162" textAnchor="middle" fill="var(--sys-color-role-on-primary-container)" fontSize="14" fontWeight="700">
            {fit(active.client_name, 16)}
          </text>
          <text x="172" y="180" textAnchor="middle" fill="var(--sys-color-role-on-primary-container)" fontSize="12">
            {shortPrice(active.price)}
          </text>
          <path d="M172 18 L180 34 L164 34 Z" fill="var(--sys-color-role-tertiary)" />
        </svg>
      </div>
      <p className="md-typescale-body-small text-[var(--sys-color-role-on-surface-variant)]">Крути по секторам</p>
    </div>
  );
}

function fit(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function shortPrice(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}м`;
  if (value >= 1000) return `${Math.round(value / 1000)}к`;
  return `${value}`;
}

function mod(value: number, base: number) {
  return ((value % base) + base) % base;
}

function roundedPolygonPath(cx: number, cy: number, r: number, sides: number, cornerRadius: number) {
  const step = (Math.PI * 2) / sides;
  const points = Array.from({ length: sides }, (_, i) => {
    const angle = -Math.PI / 2 + step * i;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });

  let d = "";
  for (let i = 0; i < sides; i++) {
    const prev = points[(i - 1 + sides) % sides];
    const curr = points[i];
    const next = points[(i + 1) % sides];
    const start = moveTowards(curr, prev, cornerRadius);
    const end = moveTowards(curr, next, cornerRadius);
    if (i === 0) d += `M ${start.x} ${start.y}`;
    else d += ` L ${start.x} ${start.y}`;
    d += ` Q ${curr.x} ${curr.y} ${end.x} ${end.y}`;
  }
  d += " Z";
  return d;
}

function moveTowards(from: { x: number; y: number }, to: { x: number; y: number }, distance: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: from.x + (dx / len) * distance, y: from.y + (dy / len) * distance };
}
