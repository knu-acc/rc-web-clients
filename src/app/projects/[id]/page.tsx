import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import DeleteProjectButton from "./ui-delete-button";

function formatKzt(n: number): string {
  if (!n) return "—";
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n)} ₸`;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
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
      <TopBar title={project.client_name} />
      <main className="flex-1 p-4 space-y-4">
        <nav className="flex items-center gap-1 text-sm flex-wrap" aria-label="Breadcrumb">
          <Link href="/projects" className="text-[var(--color-primary)] md-typescale-label-large min-h-[44px] inline-flex items-center">
            Проекты
          </Link>
          <span className="text-[var(--color-on-surface-variant)]">/</span>
          <span className="text-[var(--color-on-surface-variant)] md-typescale-label-large min-h-[44px] inline-flex items-center truncate max-w-[200px]">
            {project.client_name}
          </span>
        </nav>

        <section className="rounded-[16px] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="md-typescale-headline-small text-[var(--color-on-surface)]">{project.client_name}</h2>
            <p className="md-typescale-headline-small text-[var(--color-primary)]">{formatKzt(Number(project.price))}</p>
          </div>
          <div className="grid gap-2 md-typescale-body-medium">
            <p><span className="text-[var(--color-on-surface-variant)]">Телефон:</span> {project.phone || "—"}</p>
            <p><span className="text-[var(--color-on-surface-variant)]">Telegram:</span> {project.telegram || "—"}</p>
            <p><span className="text-[var(--color-on-surface-variant)]">Статус:</span> {project.work_status}</p>
            <p><span className="text-[var(--color-on-surface-variant)]">Оплата:</span> {project.payment_status}</p>
            <p><span className="text-[var(--color-on-surface-variant)]">Дата оплаты:</span> {project.paid_at || "—"}</p>
            <p><span className="text-[var(--color-on-surface-variant)]">Дата создания сайта:</span> {project.site_created_at || "—"}</p>
          </div>
          {project.website_url && (
            <a
              href={project.website_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[40px] items-center px-4 rounded-[20px] bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] md-typescale-label-large"
            >
              Открыть сайт
            </a>
          )}
          {project.contract_url && (
            <p className="md-typescale-body-small break-all">
              <span className="text-[var(--color-on-surface-variant)]">Договор:</span> {project.contract_url}
            </p>
          )}
          {project.notes && (
            <div>
              <p className="md-typescale-label-medium text-[var(--color-on-surface-variant)] mb-1">Заметки</p>
              <p className="md-typescale-body-medium whitespace-pre-wrap">{project.notes}</p>
            </div>
          )}
        </section>

        <div className="flex gap-2">
          <Link href={`/projects/${project.id}/edit`}>
            <md-filled-button>Редактировать</md-filled-button>
          </Link>
          <DeleteProjectButton projectId={project.id} projectName={project.client_name} />
        </div>
      </main>
    </div>
  );
}
