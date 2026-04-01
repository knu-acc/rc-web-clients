import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import DeleteProjectButton from "./ui-delete-button";
import StatusBadge from "@/components/projects/StatusBadge";
import PageSection from "@/components/material/PageSection";
import ContactActions from "@/components/projects/ContactActions";

function formatKzt(n: number): string {
  if (!n) return "—";
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n)} ₸`;
}

function detailValue(value: string | null | undefined, fallback = "—") {
  return value && value.trim() ? value : fallback;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project, error } = await supabase.from("projects").select("*").eq("id", id).single();

  if (error || !project) notFound();

  return (
    <div className="min-h-screen bg-[var(--sys-color-role-surface)] pb-10">
      <TopBar title={project.client_name} />
      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:px-6 md:py-6">
        <nav className="flex flex-wrap items-center gap-1 md-typescale-label-large" aria-label="Breadcrumb">
          <Link href="/projects" className="text-[var(--sys-color-role-primary)] min-h-[44px] inline-flex items-center">Проекты</Link>
          <span className="text-[var(--sys-color-role-on-surface-variant)]">/</span>
          <span className="text-[var(--sys-color-role-on-surface-variant)] min-h-[44px] inline-flex max-w-[240px] items-center truncate">{project.client_name}</span>
        </nav>

        <PageSection title={project.client_name}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={project.work_status} kind="work" />
                <StatusBadge value={project.payment_status} kind="payment" />
              </div>
              <p className="md-typescale-display-small text-[var(--sys-color-role-primary)]">{formatKzt(Number(project.price))}</p>
              <ContactActions
                name={project.client_name}
                phone={project.phone}
                telegram={project.telegram}
                website={project.website_url}
                note={project.notes}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/projects/${project.id}/edit`}>
                <md-filled-button>Редактировать</md-filled-button>
              </Link>
              <DeleteProjectButton projectId={project.id} projectName={project.client_name} />
            </div>
          </div>
        </PageSection>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <PageSection title="Контакты">
            <DetailRow label="Телефон" value={detailValue(project.phone)} />
            <DetailRow label="Telegram" value={detailValue(project.telegram)} />
            <DetailRow label="Сайт" value={detailValue(project.website_url)} isLink={Boolean(project.website_url)} />
          </PageSection>

          <PageSection title="Статусы и даты">
            <DetailRow label="Статус работы" value={project.work_status} />
            <DetailRow label="Статус оплаты" value={project.payment_status} />
            <DetailRow label="Дата оплаты" value={detailValue(project.paid_at)} />
            <DetailRow label="Дата создания сайта" value={detailValue(project.site_created_at)} />
          </PageSection>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <PageSection title="Документы">
            {project.contract_url ? (
              <p className="break-all md-typescale-body-medium text-[var(--sys-color-role-on-surface)]">{project.contract_url}</p>
            ) : (
              <p className="md-typescale-body-medium text-[var(--sys-color-role-on-surface-variant)]">Договор не прикреплён.</p>
            )}
          </PageSection>

          <PageSection title="Заметки">
            <p className="whitespace-pre-wrap md-typescale-body-large text-[var(--sys-color-role-on-surface)]">
              {detailValue(project.notes, "Пока без заметок.")}
            </p>
          </PageSection>
        </div>
      </main>
    </div>
  );
}

function DetailRow({ label, value, isLink = false }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div className="rounded-[var(--sys-shape-4)] bg-[var(--sys-color-role-surface-container)] px-4 py-3">
      <p className="md-typescale-label-medium text-[var(--sys-color-role-on-surface-variant)]">{label}</p>
      {isLink && value !== "—" ? (
        <a href={value} target="_blank" rel="noreferrer" className="break-all md-typescale-body-large text-[var(--sys-color-role-primary)]">
          {value}
        </a>
      ) : (
        <p className="break-words md-typescale-body-large text-[var(--sys-color-role-on-surface)]">{value}</p>
      )}
    </div>
  );
}
