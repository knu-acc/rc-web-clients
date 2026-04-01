"use client";

import {
  type ButtonHTMLAttributes,
  type ReactNode,
  useRef,
  useEffect,
} from "react";
import { cx } from "./primitives";

type Variant = "filled" | "tonal" | "outlined" | "text" | "elevated";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  fullWidth?: boolean;
}

const TAG_MAP: Record<Variant, string> = {
  filled: "md-filled-button",
  tonal: "md-filled-tonal-button",
  outlined: "md-outlined-button",
  text: "md-text-button",
  elevated: "md-filled-tonal-button",
};

export default function Button({
  variant = "filled",
  fullWidth,
  className = "",
  disabled,
  children,
  type = "button",
  onClick,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onClick) return;
    const handler = onClick as unknown as EventListener;
    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, [onClick]);

  const Tag = TAG_MAP[variant] as string;

  return (
    // @ts-expect-error custom element
    <Tag
      ref={ref}
      type={type}
      disabled={disabled || undefined}
      class={cx("ui-interactive", fullWidth && "w-full", className)}
      style={fullWidth ? { display: "block", width: "100%" } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
