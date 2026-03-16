"use client";

import Link from "next/link";
import type { Project } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface ProjectCardProps {
  project: Project;
}

function formatPrice(n: number): string {
  if (n === 0) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(n) + " ₸";
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-[16px] bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/50 p-4">
      <div className="flex justify-between items-start gap-3">
        <h2 className="md-typescale-title-medium text-[var(--color-on-surface)] truncate flex-1">
          {project.client_name}
        </h2>
        <span className="md-typescale-title-medium text-[var(--color-primary)] shrink-0">
          {formatPrice(project.price)}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <StatusBadge value={project.work_status} kind="work" />
        <StatusBadge value={project.payment_status} kind="payment" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Link href={`/projects/${project.id}`}>
          <md-filled-button>Открыть</md-filled-button>
        </Link>
        <Link
          href={`/projects/${project.id}/edit`}
          aria-label="Редактировать проект"
          title="Редактировать"
        >
          <md-outlined-button>
            <svg className="w-5 h-5" slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L12 14l-4 1 1-4 7.5-7.5z" />
            </svg>
            Изменить
          </md-outlined-button>
        </Link>
      </div>
    </article>
  );
}
