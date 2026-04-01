"use client";

import type { WorkStatus, PaymentStatus } from "@/lib/types";
import { WORK_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/lib/constants";

type BadgeKind = "work" | "payment";

const workColors: Record<WorkStatus, string> = {
  planned: "bg-[var(--sys-color-role-surface-container-high)] text-[var(--sys-color-role-on-surface-variant)]",
  in_progress: "bg-[var(--sys-color-role-primary-container)] text-[var(--sys-color-role-on-primary-container)]",
  review: "bg-[var(--sys-color-role-secondary-container)] text-[var(--sys-color-role-on-secondary-container)]",
  done: "bg-[var(--sys-color-role-tertiary-container)] text-[var(--sys-color-role-on-tertiary-container)]",
};

const paymentColors: Record<PaymentStatus, string> = {
  unpaid: "bg-[var(--sys-color-role-error-container)] text-[var(--sys-color-role-on-error-container)]",
  prepaid: "bg-[var(--sys-color-role-secondary-container)] text-[var(--sys-color-role-on-secondary-container)]",
  paid: "bg-[var(--sys-color-role-primary-container)] text-[var(--sys-color-role-on-primary-container)]",
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
    "bg-[var(--sys-color-role-surface-container-high)] text-[var(--sys-color-role-on-surface-variant)]";

  return (
    <span
      className={`inline-flex items-center rounded-[var(--sys-shape-full)] px-3 py-1 md-typescale-label-medium ${colorClass} ${className}`}
    >
      {getLabel(value, kind)}
    </span>
  );
}
