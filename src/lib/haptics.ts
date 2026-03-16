export function vibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  navigator.vibrate(pattern);
}

export function hapticLight() {
  vibrate(8);
}

export function hapticSelection() {
  vibrate([8, 14, 8]);
}

export function hapticSuccess() {
  vibrate([12, 24, 16]);
}
