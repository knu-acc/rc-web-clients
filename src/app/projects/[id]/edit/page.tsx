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
  const { data: project, error } = await supabase.from("projects").select("*").eq("id", id).single();

  if (error || !project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(103,80,164,0.14),transparent_28%),var(--color-surface)]">
      <TopBar title="Редактирование" subtitle={`Проект: ${project.client_name}`} />
      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
        <nav className="flex flex-wrap items-center gap-1 md-typescale-label-large" aria-label="Breadcrumb">
          <Link href="/projects" className="text-[var(--color-primary)] min-h-[44px] inline-flex items-center">Проекты</Link>
          <span className="text-[var(--color-on-surface-variant)]">/</span>
          <Link href={`/projects/${id}`} className="text-[var(--color-primary)] min-h-[44px] inline-flex max-w-[220px] items-center truncate">
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
