"use client";

import { useId, useRef, useEffect, type ChangeEvent } from "react";

interface InputProps {
  label?: string;
  error?: string;
  hint?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  inputMode?: string;
  name?: string;
}

export default function Input({
  label,
  error,
  hint,
  value,
  onChange,
  type = "text",
  required,
  disabled,
  placeholder,
  id: idProp,
  className = "",
  min,
  max,
  step,
  maxLength,
  autoComplete,
  inputMode,
  name,
  autoFocus,
}: InputProps) {
  const genId = useId();
  const id = idProp ?? genId;
  const ref = useRef<HTMLElement & { value: string }>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onChange) return;
    const handler = () => {
      const syntheticEvent = {
        target: { value: el.value },
      } as ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    };
    el.addEventListener("input", handler);
    return () => el.removeEventListener("input", handler);
  }, [onChange]);

  useEffect(() => {
    if (ref.current && value !== undefined && ref.current.value !== value) {
      ref.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    if (autoFocus && ref.current) {
      setTimeout(() => ref.current?.focus(), 100);
    }
  }, [autoFocus]);

  return (
    <div className={`w-full ${className}`}>
      <md-outlined-text-field
        ref={ref}
        id={id}
        label={label || undefined}
        type={type}
        value={value}
        required={required || undefined}
        disabled={disabled || undefined}
        placeholder={placeholder || undefined}
        error={!!error || undefined}
        error-text={error || undefined}
        supporting-text={!error ? hint : undefined}
        min={min !== undefined ? String(min) : undefined}
        max={max !== undefined ? String(max) : undefined}
        step={step !== undefined ? String(step) : undefined}
        max-length={maxLength !== undefined ? String(maxLength) : undefined}
        autocomplete={autoComplete || undefined}
        inputmode={inputMode || undefined}
        name={name || undefined}
        class="ui-input"
        style={{ width: "100%" }}
      />
    </div>
  );
}
