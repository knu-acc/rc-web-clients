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
    <article className="rounded-[var(--shape-xl)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[box-shadow,transform,border-color] duration-[var(--motion-duration-hover)] ease-[var(--motion-easing-standard)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1.5">
          <h2 className="truncate md-typescale-title-large text-[var(--color-on-surface)]">{project.client_name}</h2>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={project.work_status} kind="work" />
            <StatusBadge value={project.payment_status} kind="payment" />
          </div>
        </div>
        <p className="shrink-0 text-right md-typescale-title-large text-[var(--color-primary)]">{formatPrice(project.price)}</p>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        <div className="rounded-[var(--shape-l)] bg-[var(--color-surface-container)] px-4 py-3">
          <p className="md-typescale-label-medium text-[var(--color-on-surface-variant)]">Телефон</p>
          <p className="md-typescale-body-large text-[var(--color-on-surface)]">{project.phone || "Не указан"}</p>
        </div>
        <div className="rounded-[var(--shape-l)] bg-[var(--color-surface-container)] px-4 py-3">
          <p className="md-typescale-label-medium text-[var(--color-on-surface-variant)]">Telegram</p>
          <p className="md-typescale-body-large text-[var(--color-on-surface)]">{project.telegram || "Не указан"}</p>
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
