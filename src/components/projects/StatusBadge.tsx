"use client";

import type { WorkStatus, PaymentStatus } from "@/lib/types";
import { WORK_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/lib/constants";

type BadgeKind = "work" | "payment";

const workColors: Record<WorkStatus, string> = {
  planned: "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]",
  in_progress: "bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]",
  review: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]",
  done: "bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)]",
};

const paymentColors: Record<PaymentStatus, string> = {
  unpaid: "bg-[var(--color-error-container)] text-[var(--color-on-error-container)]",
  prepaid: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]",
  paid: "bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]",
};

function getLabel(value: string, kind: BadgeKind): string {
  if (kind === "work") {
    return WORK_STATUS_OPTIONS.find((o) => o.value === value)?.label ?? value;
  }
  return PAYMENT_STATUS_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

interface StatusBadgeProps {
  value: WorkStatus | PaymentStatus;
  kind: BadgeKind;
  className?: string;
}

export default function StatusBadge({ value, kind, className = "" }: StatusBadgeProps) {
  const colors = kind === "work" ? workColors : paymentColors;
  const colorClass =
    colors[value as keyof typeof colors] ??
    "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 md-typescale-label-medium ${colorClass} ${className}`}
    >
      {getLabel(value, kind)}
    </span>
  );
}
