import type { AnchorHTMLAttributes } from "react";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { cx } from "./primitives";

type UiLinkProps = NextLinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    muted?: boolean;
  };

export default function Link({ className, muted, ...props }: UiLinkProps) {
  return (
    <NextLink
      {...props}
      className={cx(
        "ui-interactive inline-flex min-h-11 items-center rounded-full px-3 md-typescale-label-large",
        muted
          ? "text-[var(--color-on-surface-variant)]"
          : "text-[var(--color-primary)]",
        className,
      )}
    />
  );
}
