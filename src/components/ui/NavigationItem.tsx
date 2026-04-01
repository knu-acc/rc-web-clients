import Link from "./Link";
import { cx } from "./primitives";

interface NavigationItemProps {
  href: string;
  active?: boolean;
  label: string;
  iconPath: string;
}

export default function NavigationItem({
  href,
  active,
  label,
  iconPath,
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      className="min-w-[104px] flex-col justify-center gap-1 px-4 py-2 text-[var(--color-on-surface-variant)]"
      aria-current={active ? "page" : undefined}
      muted
    >
      <div
        className={cx(
          "flex h-8 min-w-16 items-center justify-center rounded-full px-5 transition-colors",
          active
            ? "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]"
            : "text-[var(--color-on-surface-variant)]",
        )}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={iconPath}
          />
        </svg>
      </div>
      <span
        className={cx(
          "md-typescale-label-medium",
          active
            ? "text-[var(--color-on-surface)]"
            : "text-[var(--color-on-surface-variant)]",
        )}
      >
        {label}
      </span>
    </Link>
  );
}
