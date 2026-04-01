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
        "rounded-[var(--sys-shape-xl)] border p-5 md:p-6 space-y-4",
        tonal
          ? "border-transparent bg-[var(--sys-color-role-primary-container)] text-[var(--sys-color-role-on-primary-container)]"
          : "border-[var(--sys-color-role-outline-variant)] bg-[var(--sys-color-role-surface-container-low)] text-[var(--sys-color-role-on-surface)]",
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
                ? "text-[var(--sys-color-role-on-primary-container)]/80"
                : "text-[var(--sys-color-role-on-surface-variant)]",
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
