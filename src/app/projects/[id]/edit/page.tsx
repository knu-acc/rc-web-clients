import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/projects/ProjectForm";
import TopBar from "@/components/layout/TopBar";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar title="Редактирование" />
      <main className="flex-1 p-4 pt-4">
        <nav className="mb-4 flex items-center gap-1 text-sm flex-wrap" aria-label="Breadcrumb">
          <Link href="/projects" className="text-[var(--color-primary)] font-medium min-h-[44px] inline-flex items-center">
            Проекты
          </Link>
          <span className="text-[var(--color-on-surface-variant)]">/</span>
          <Link href={`/projects/${id}`} className="text-[var(--color-primary)] font-medium min-h-[44px] inline-flex items-center truncate max-w-[200px]">
            {project.client_name}
          </Link>
          <span className="text-[var(--color-on-surface-variant)]">/</span>
          <span className="text-[var(--color-on-surface-variant)] min-h-[44px] inline-flex items-center">Редактирование</span>
        </nav>
        <ProjectForm project={project} />
      </main>
    </div>
  );
}
