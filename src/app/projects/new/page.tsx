import Link from "next/link";
import ProjectForm from "@/components/projects/ProjectForm";
import TopBar from "@/components/layout/TopBar";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(103,80,164,0.14),transparent_28%),var(--color-surface)]">
      <TopBar title="Новый проект" subtitle="Заполняй только важное: остальное можно дополнить позже" />
      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
        <nav className="flex flex-wrap items-center gap-1 md-typescale-label-large" aria-label="Breadcrumb">
          <Link href="/projects" className="m3-interactive rounded-full px-2 text-[var(--color-primary)] min-h-[44px] inline-flex items-center focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/35">
            Проекты
          </Link>
          <span className="text-[var(--color-on-surface-variant)]">/</span>
          <span className="text-[var(--color-on-surface-variant)] min-h-[44px] inline-flex items-center">Новый проект</span>
        </nav>
        <ProjectForm />
      </main>
    </div>
  );
}
