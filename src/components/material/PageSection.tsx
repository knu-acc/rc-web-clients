import type { ReactNode } from "react";

interface PageSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  tonal?: boolean;
  className?: string;
}

export default function PageSection({
  title,
  description,
  children,
  tonal = false,
  className = "",
}: PageSectionProps) {
  return (
    <section
      className={[
        "rounded-[var(--shape-xl)] border p-5 md:p-6 space-y-4 m3-elevation-1",
        tonal
          ? "border-transparent bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]"
          : "border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)]",
        className,
      ].join(" ")}
    >
      <div className="space-y-1">
        <h2 className="md-typescale-title-large">{title}</h2>
        {description ? (
          <p
            className={[
              "md-typescale-body-medium",
              tonal
                ? "text-[color-mix(in_srgb,var(--color-on-primary-container)_78%,transparent)]"
                : "text-[var(--color-on-surface-variant)]",
            ].join(" ")}
          >
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
