"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { SITE_PASSWORD } from "@/lib/constants";

const STORAGE_KEY = "rc_site_unlocked";

function getUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export default function SitePasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLElement & { value: string }>(null);

  useEffect(() => {
    setUnlocked(getUnlocked());
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const handler = () => setCode(el.value);
    el.addEventListener("input", handler);
    return () => el.removeEventListener("input", handler);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (code.trim() === SITE_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
    } else {
      setError("Неверный код");
    }
  };

  if (!mounted || !unlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-surface)]">
        <div className="w-full max-w-xs space-y-6">
          <div>
            <h1 className="md-typescale-headline-small text-[var(--color-on-surface)]">
              Доступ к приложению
            </h1>
            <p className="md-typescale-body-medium text-[var(--color-on-surface-variant)] mt-1">
              Введите код доступа
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <md-outlined-text-field
              ref={inputRef}
              label="Код доступа"
              type="password"
              value={code}
              max-length="6"
              input-mode="numeric"
              style={{ width: "100%" }}
            />
            {error && (
              <p className="md-typescale-body-small text-[var(--color-error)]">{error}</p>
            )}
            <md-filled-button type="submit" style={{ width: "100%" }}>
              Войти
            </md-filled-button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
