import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  supporting?: string;
  trailing?: ReactNode;
  className?: string;
}

export default function MetricCard({
  label,
  value,
  supporting,
  trailing,
  className = "",
}: MetricCardProps) {
  return (
    <div
      className={[
        "rounded-[var(--sys-shape-xl)] border border-[var(--sys-color-role-outline-variant)] bg-[var(--sys-color-role-surface-container)] p-4 md:p-5",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="md-typescale-label-large text-[var(--sys-color-role-on-surface-variant)]">{label}</p>
          <p className="md-typescale-headline-small text-[var(--sys-color-role-on-surface)]">{value}</p>
          {supporting ? (
            <p className="md-typescale-body-small text-[var(--sys-color-role-on-surface-variant)]">{supporting}</p>
          ) : null}
        </div>
        {trailing}
      </div>
    </div>
  );
}
