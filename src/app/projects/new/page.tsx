import Link from "@/components/ui/Link";
import Card from "@/components/ui/Card";
import ProjectForm from "@/components/projects/ProjectForm";
import TopBar from "@/components/layout/TopBar";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(103,80,164,0.14),transparent_28%),var(--color-surface)]">
      <TopBar
        title="Новый проект"
        subtitle="Заполняй только важное: остальное можно дополнить позже"
      />
      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
        <nav aria-label="Breadcrumb">
          <Card className="flex flex-wrap items-center gap-1 border-0 bg-transparent p-0 md-typescale-label-large">
            <Link href="/projects" className="px-0">
              Проекты
            </Link>
            <span className="text-[var(--color-on-surface-variant)]">/</span>
            <span className="text-[var(--color-on-surface-variant)] min-h-[44px] inline-flex items-center">
              Новый проект
            </span>
          </Card>
        </nav>
        <ProjectForm />
      </main>
    </div>
  );
}
