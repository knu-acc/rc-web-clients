"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Project, WorkStatus } from "@/lib/types";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import FAB from "@/components/layout/FAB";
import ProjectFilters from "@/components/projects/ProjectFilters";
import ProjectCard from "@/components/projects/ProjectCard";
import RevenueBlobChart from "@/components/projects/RevenueBlobChart";
import MetricCard from "@/components/material/MetricCard";
import PageSection from "@/components/material/PageSection";

function getCurrentMonth(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

function formatKzt(value: number): string {
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value)} ₸`;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WorkStatus | "all">("all");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const fetchProjects = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      setProjects([]);
    } else {
      setProjects(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.work_status === filter);
  const monthlyTotal = projects
    .filter((p) => p.paid_at?.slice(0, 7) === selectedMonth)
    .reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const paidProjects = projects.filter((p) => p.payment_status === "paid").length;

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <TopBar title="Проекты" />
      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 md:px-6 md:py-6">
        <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <PageSection title="За месяц" tonal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="md-typescale-display-small">{formatKzt(monthlyTotal)}</p>
              </div>
              <InputMonth value={selectedMonth} onChange={setSelectedMonth} />
            </div>
          </PageSection>
          <MetricCard label="Всего" value={String(projects.length)} />
          <MetricCard label="Оплачено" value={String(paidProjects)} />
        </section>

        <RevenueBlobChart projects={projects} month={selectedMonth} />

        <PageSection title="Список">
          <ProjectFilters value={filter} onChange={setFilter} />
          {loading ? (
            <p className="py-8 text-center md-typescale-body-medium text-[var(--color-on-surface-variant)]">Загрузка…</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-[24px] bg-[var(--color-surface-container)] px-5 py-10 text-center">
              <p className="md-typescale-title-medium text-[var(--color-on-surface)]">
                {projects.length === 0 ? "Проектов пока нет" : "Нет проектов с этим статусом"}
              </p>
            </div>
          ) : (
            <ul className="grid gap-4 lg:grid-cols-2">
              {filtered.map((project) => (
                <li key={project.id}>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          )}
        </PageSection>
      </main>
      <FAB />
      <BottomNav />
    </div>
  );
}

function InputMonth({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex min-w-[196px] flex-col gap-1">
      <input
        type="month"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-14 rounded-2xl border border-[color-mix(in_srgb,var(--color-on-primary-container)_24%,transparent)] bg-[color-mix(in_srgb,var(--color-primary-container)_55%,white)] px-4 text-[var(--color-on-primary-container)] outline-none"
        aria-label="Выбор месяца для графика дохода"
      />
    </label>
  );
}
