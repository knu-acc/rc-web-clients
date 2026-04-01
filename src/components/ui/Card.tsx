import { cx } from "./primitives";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tonal?: boolean;
}

export default function Card({ tonal, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cx(
        "rounded-[var(--shape-xl)] border border-[var(--color-outline-variant)] p-4 md:p-5",
        tonal
          ? "bg-[color-mix(in_srgb,var(--color-primary-container)_55%,white)] text-[var(--color-on-primary-container)]"
          : "bg-[var(--color-surface-container)] text-[var(--color-on-surface)]",
        className,
      )}
    />
  );
}
