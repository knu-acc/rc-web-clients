"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import MonthCookieWheel from "@/components/projects/MonthCookieWheel";

function getCurrentMonth(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

function formatKzt(value: number): string {
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value)} ₸`;
}

type SortValue = "created_desc" | "created_asc" | "price_desc" | "price_asc";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WorkStatus | "all">("all");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortValue>("created_desc");

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

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const base = filter === "all" ? projects : projects.filter((p) => p.work_status === filter);
    const searched = normalized
      ? base.filter((p) =>
          [p.client_name, p.phone, p.telegram, p.website_url]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(normalized))
        )
      : base;

    return [...searched].sort((a, b) => {
      switch (sort) {
        case "created_asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "price_desc":
          return Number(b.price) - Number(a.price);
        case "price_asc":
          return Number(a.price) - Number(b.price);
        case "created_desc":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [projects, filter, search, sort]);

  const monthlyProjects = projects.filter((p) => p.paid_at?.slice(0, 7) === selectedMonth);
  const monthlyTotal = monthlyProjects.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const paidProjects = projects.filter((p) => p.payment_status === "paid").length;

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <TopBar title="Проекты" subtitle="Поиск, сортировка и быстрые действия под телефон" />
      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 md:px-6 md:py-6">
        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <PageSection title="За месяц" tonal>
            <div className="grid gap-4 md:grid-cols-[1fr_300px] md:items-center">
              <div className="space-y-3">
                <p className="md-typescale-display-small">{formatKzt(monthlyTotal)}</p>
                <p className="md-typescale-body-medium text-[color-mix(in_srgb,var(--color-on-primary-container)_78%,transparent)]">
                  {monthlyProjects.length} проектов в {selectedMonth}
                </p>
                <div className="flex gap-3">
                  <MetricCard label="Всего" value={String(projects.length)} className="flex-1 bg-[color-mix(in_srgb,var(--color-primary-container)_70%,white)]" />
                  <MetricCard label="Оплачено" value={String(paidProjects)} className="flex-1 bg-[color-mix(in_srgb,var(--color-primary-container)_70%,white)]" />
                </div>
              </div>
              <MonthCookieWheel value={selectedMonth} onChange={setSelectedMonth} />
            </div>
          </PageSection>
          <RevenueBlobChart projects={projects} month={selectedMonth} />
        </section>

        <PageSection title="Найти и отсортировать">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <Input
              label="Поиск по клиентам"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Имя, телефон, Telegram, сайт"
              type="search"
              autoComplete="off"
              inputMode="search"
            />
            <Select
              label="Сортировка"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortValue)}
              options={[
                { value: "created_desc", label: "Новые сначала" },
                { value: "created_asc", label: "Старые сначала" },
                { value: "price_desc", label: "Цена ↓" },
                { value: "price_asc", label: "Цена ↑" },
              ]}
            />
          </div>
          <ProjectFilters value={filter} onChange={setFilter} />
        </PageSection>

        <PageSection title="Список проектов">
          {loading ? (
            <p className="py-8 text-center md-typescale-body-medium text-[var(--color-on-surface-variant)]">Загрузка…</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-[24px] bg-[var(--color-surface-container)] px-5 py-10 text-center">
              <p className="md-typescale-title-medium text-[var(--color-on-surface)]">
                {projects.length === 0 ? "Проектов пока нет" : "Ничего не найдено"}
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
