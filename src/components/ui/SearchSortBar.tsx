"use client";

import { hapticLight } from "@/lib/haptics";
import { useStateLayerRipple } from "@/lib/motion";

type SortValue = "created_desc" | "created_asc" | "price_desc" | "price_asc";

interface SearchSortBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortValue;
  onSortChange: (value: SortValue) => void;
}

const sortLabels: Record<SortValue, string> = {
  created_desc: "Новые",
  created_asc: "Старые",
  price_desc: "Цена ↓",
  price_asc: "Цена ↑",
};

const order: SortValue[] = ["created_desc", "created_asc", "price_desc", "price_asc"];

export default function SearchSortBar({ search, onSearchChange, sort, onSortChange }: SearchSortBarProps) {
  const onRipple = useStateLayerRipple();

  return (
    <div className="flex items-center gap-2 rounded-[var(--shape-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] px-3 py-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
        </svg>
      </div>
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Поиск по клиентам"
        type="search"
        autoComplete="off"
        inputMode="search"
        className="min-w-0 flex-1 bg-transparent px-1 text-[var(--color-on-surface)] outline-none placeholder:text-[color-mix(in_srgb,var(--color-on-surface-variant)_74%,white)] md-typescale-body-large"
      />
      <button
        type="button"
        onClick={() => {
          const next = order[(order.indexOf(sort) + 1) % order.length];
          hapticLight();
          onSortChange(next);
        }}
        className="m3-interactive inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--color-tertiary-container)] px-3 text-[var(--color-on-tertiary-container)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/35" onPointerDown={onRipple}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M6 12h12m-9 6h6" />
        </svg>
        <span className="md-typescale-label-large">{sortLabels[sort]}</span>
      </button>
    </div>
  );
}
