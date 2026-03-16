"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import FAB from "@/components/layout/FAB";
import PageSection from "@/components/material/PageSection";
import ClientCookieWheel from "@/components/projects/ClientCookieWheel";
import ContactActions from "@/components/projects/ContactActions";

function formatKzt(value: number) {
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value)} ₸`;
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    setProjects(data ?? []);
    if (data?.[0]) setSelected(data[0]);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const summary = useMemo(() => ({
    total: projects.length,
    paid: projects.filter((p) => p.payment_status === "paid").length,
    money: projects.reduce((sum, p) => sum + Number(p.price || 0), 0),
  }), [projects]);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <TopBar title="Главная" subtitle="Крути клиентов, звони, редактируй, добавляй" />
      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 md:px-6 md:py-6">
        <PageSection title="Колесо клиентов" tonal>
          <div className="grid gap-5 lg:grid-cols-[380px_1fr] lg:items-center">
            <ClientCookieWheel projects={projects} onSelect={setSelected} />
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <MiniStat label="Всего" value={String(summary.total)} />
                <MiniStat label="Оплачено" value={String(summary.paid)} />
                <MiniStat label="Сумма" value={formatKzt(summary.money)} />
              </div>
              {selected ? (
                <div className="rounded-[var(--shape-xl)] bg-[color-mix(in_srgb,var(--color-primary-container)_55%,white)] p-5 text-[var(--color-on-primary-container)]">
                  <p className="md-typescale-headline-small">{selected.client_name}</p>
                  <p className="mt-1 md-typescale-title-medium">{formatKzt(Number(selected.price || 0))}</p>
                  <div className="mt-4">
                    <ContactActions
                      name={selected.client_name}
                      phone={selected.phone}
                      telegram={selected.telegram}
                      website={selected.website_url}
                      note={selected.notes}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </PageSection>
      </main>
      <FAB />
      <BottomNav />
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--shape-l)] bg-[color-mix(in_srgb,var(--color-primary-container)_50%,white)] px-4 py-3 text-[var(--color-on-primary-container)]">
      <p className="md-typescale-label-medium">{label}</p>
      <p className="md-typescale-title-medium">{value}</p>
    </div>
  );
}
