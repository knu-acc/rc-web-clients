"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";
import type { WorkStatus } from "@/lib/types";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import FAB from "@/components/layout/FAB";
import ProjectFilters from "@/components/projects/ProjectFilters";
import ProjectCard from "@/components/projects/ProjectCard";
import RevenueBlobChart from "@/components/projects/RevenueBlobChart";

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
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
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

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.work_status === filter);
  const monthlyTotal = projects
    .filter((p) => p.paid_at?.slice(0, 7) === selectedMonth)
    .reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <TopBar title="Проекты" />
      <main className="flex-1 p-4 space-y-4">
        <section className="rounded-[16px] p-4 bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]">
          <p className="md-typescale-label-large opacity-90">Доход за месяц</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="md-typescale-headline-small">{formatKzt(monthlyTotal)}</p>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="min-h-[40px] px-3 rounded-[8px] border border-[var(--color-outline)] bg-[var(--color-surface)] text-[var(--color-on-surface)]"
              aria-label="Выбор месяца для графика дохода"
            />
          </div>
        </section>

        <RevenueBlobChart projects={projects} month={selectedMonth} />

        <ProjectFilters value={filter} onChange={setFilter} />
        {loading ? (
          <p className="md-typescale-body-medium text-[var(--color-on-surface-variant)] py-8 text-center">
            Загрузка…
          </p>
        ) : filtered.length === 0 ? (
          <p className="md-typescale-body-medium text-[var(--color-on-surface-variant)] py-8 text-center">
            {projects.length === 0
              ? "Нет проектов. Нажмите + чтобы добавить."
              : "Нет проектов с выбранным статусом."}
          </p>
        ) : (
          <ul className="space-y-3 mt-4">
            {filtered.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        )}
      </main>
      <FAB />
      <BottomNav />
    </div>
  );
}
