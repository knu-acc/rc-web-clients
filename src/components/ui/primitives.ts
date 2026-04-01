export const INTERACTIVE_STATES = {
  default: "ui-state-default",
  hover: "ui-state-hover",
  focus: "ui-state-focus",
  pressed: "ui-state-pressed",
  disabled: "ui-state-disabled",
} as const;

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
