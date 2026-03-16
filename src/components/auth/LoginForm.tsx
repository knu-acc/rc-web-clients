"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<HTMLElement & { value: string }>(null);
  const passwordRef = useRef<HTMLElement & { value: string }>(null);

  useEffect(() => {
    const el = emailRef.current;
    if (!el) return;
    const handler = () => setEmail(el.value);
    el.addEventListener("input", handler);
    return () => el.removeEventListener("input", handler);
  }, []);

  useEffect(() => {
    const el = passwordRef.current;
    if (!el) return;
    const handler = () => setPassword(el.value);
    el.addEventListener("input", handler);
    return () => el.removeEventListener("input", handler);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message === "Invalid login credentials" ? "Неверный email или пароль" : err.message);
      return;
    }
    router.push("/projects");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-surface)]">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="md-typescale-headline-medium text-[var(--color-on-surface)]">
            Вход
          </h1>
          <p className="md-typescale-body-medium text-[var(--color-on-surface-variant)] mt-1">
            Email и пароль от вашего аккаунта Supabase
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <md-outlined-text-field
            ref={emailRef}
            label="Email"
            type="email"
            value={email}
            required
            style={{ width: "100%" }}
          />
          <md-outlined-text-field
            ref={passwordRef}
            label="Пароль"
            type="password"
            value={password}
            required
            style={{ width: "100%" }}
          />
          {error && (
            <p className="md-typescale-body-small text-[var(--color-error)]">{error}</p>
          )}
          <md-filled-button
            type="submit"
            disabled={loading || undefined}
            style={{ width: "100%" }}
          >
            {loading ? "Вход…" : "Войти"}
          </md-filled-button>
        </form>
      </div>
    </div>
  );
}
