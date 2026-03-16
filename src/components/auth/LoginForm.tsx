"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PageSection from "@/components/material/PageSection";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(103,80,164,0.16),transparent_28%),var(--color-surface)] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-xl">
        <PageSection
          title="Вход в CRM"
          description="Материал 3-стиль: спокойная поверхность, чистая иерархия и только нужные поля."
          tonal
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-[var(--color-on-surface)]">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error ? <p className="md-typescale-body-small text-[var(--color-error)]">{error}</p> : null}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Вход…" : "Войти"}
              </Button>
            </div>
          </form>
        </PageSection>
      </div>
    </div>
  );
}
