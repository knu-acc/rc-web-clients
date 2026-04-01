"use client";

import Link from "next/link";
import type { Project } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import ContactActions from "./ContactActions";

interface ProjectCardProps {
  project: Project;
}

function formatPrice(n: number): string {
  if (n === 0) return "—";
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n)} ₸`;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-[var(--sys-shape-xl)] border border-[var(--sys-color-role-outline-variant)] bg-[var(--sys-color-role-surface-container-low)] p-5 shadow-[var(--sys-elevation-1)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1.5">
          <h2 className="truncate md-typescale-title-large text-[var(--sys-color-role-on-surface)]">{project.client_name}</h2>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={project.work_status} kind="work" />
            <StatusBadge value={project.payment_status} kind="payment" />
          </div>
        </div>
        <p className="shrink-0 text-right md-typescale-title-large text-[var(--sys-color-role-primary)]">{formatPrice(project.price)}</p>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        <div className="rounded-[var(--sys-shape-l)] bg-[var(--sys-color-role-surface-container)] px-4 py-3">
          <p className="md-typescale-label-medium text-[var(--sys-color-role-on-surface-variant)]">Телефон</p>
          <p className="md-typescale-body-large text-[var(--sys-color-role-on-surface)]">{project.phone || "Не указан"}</p>
        </div>
        <div className="rounded-[var(--sys-shape-l)] bg-[var(--sys-color-role-surface-container)] px-4 py-3">
          <p className="md-typescale-label-medium text-[var(--sys-color-role-on-surface-variant)]">Telegram</p>
          <p className="md-typescale-body-large text-[var(--sys-color-role-on-surface)]">{project.telegram || "Не указан"}</p>
        </div>
      </div>

      <div className="mt-4">
        <ContactActions compact name={project.client_name} phone={project.phone} telegram={project.telegram} website={project.website_url} note={project.notes} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link href={`/projects/${project.id}`} className="block">
          <md-filled-button style={{ width: "100%" }}>Открыть</md-filled-button>
        </Link>
        <Link href={`/projects/${project.id}/edit`} className="block">
          <md-outlined-button style={{ width: "100%" }}>Редактировать</md-outlined-button>
        </Link>
      </div>
    </article>
  );
}
