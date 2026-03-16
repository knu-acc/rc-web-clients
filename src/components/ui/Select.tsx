"use client";

import { useId, useRef, useEffect, type ChangeEvent } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export default function Select({
  label,
  options,
  value,
  onChange,
  error,
  disabled,
  id: idProp,
  className = "",
}: SelectProps) {
  const genId = useId();
  const id = idProp ?? genId;
  const ref = useRef<HTMLElement & { value: string }>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onChange) return;
    const handler = () => {
      const syntheticEvent = {
        target: { value: el.value },
      } as ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    };
    el.addEventListener("change", handler);
    el.addEventListener("input", handler);
    return () => {
      el.removeEventListener("change", handler);
      el.removeEventListener("input", handler);
    };
  }, [onChange]);

  useEffect(() => {
    if (ref.current && value !== undefined && ref.current.value !== value) {
      ref.current.value = value;
    }
  }, [value]);

  return (
    <div className={`w-full ${className}`}>
      <md-outlined-select
        ref={ref}
        id={id}
        label={label || undefined}
        value={value}
        disabled={disabled || undefined}
        error={!!error || undefined}
        error-text={error || undefined}
        style={{ width: "100%" }}
      >
        {options.map((opt) => (
          <md-select-option key={opt.value} value={opt.value} selected={opt.value === value || undefined}>
            <div slot="headline">{opt.label}</div>
          </md-select-option>
        ))}
      </md-outlined-select>
    </div>
  );
}
