"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

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
  const Tag = TAG_MAP[variant] as string;

  return (
    // @ts-expect-error custom element
    <Tag
      type={type}
      disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      class={[fullWidth && "w-full", className].filter(Boolean).join(" ")}
      style={fullWidth ? { display: "block", width: "100%" } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
