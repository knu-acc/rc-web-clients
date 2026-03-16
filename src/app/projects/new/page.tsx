import Link from "next/link";
import ProjectForm from "@/components/projects/ProjectForm";
import TopBar from "@/components/layout/TopBar";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title="Новый проект" />
      <main className="flex-1 p-4 pt-4">
        <nav className="mb-4 flex items-center gap-1 text-sm flex-wrap" aria-label="Breadcrumb">
          <Link href="/projects" className="text-[var(--color-primary)] md-typescale-label-large min-h-[44px] inline-flex items-center">
            Проекты
          </Link>
          <span className="text-[var(--color-on-surface-variant)]">/</span>
          <span className="text-[var(--color-on-surface-variant)] md-typescale-label-large min-h-[44px] inline-flex items-center">Новый проект</span>
        </nav>
        <div className="mb-4 rounded-[16px] bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] p-4">
          <p className="md-typescale-body-medium">Минимум для сохранения: название, цена и статусы.</p>
        </div>
        <ProjectForm />
      </main>
    </div>
  );
}
