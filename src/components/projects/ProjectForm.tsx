"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Project, WorkStatus, PaymentStatus } from "@/lib/types";
import { WORK_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS, CONTRACTS_BUCKET } from "@/lib/constants";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { SelectOption } from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import Textarea from "@/components/ui/Textarea";
import PageSection from "@/components/material/PageSection";
import ContactActions from "./ContactActions";
import ContactImportButton from "./ContactImportButton";
import { hapticSuccess } from "@/lib/haptics";

interface ProjectFormProps {
  project?: Project | null;
}

const workOptions: SelectOption[] = WORK_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
const paymentOptions: SelectOption[] = PAYMENT_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }));

function toInputDate(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [projectName, setProjectName] = useState(project?.client_name ?? "");
  const [phone, setPhone] = useState(project?.phone ?? "");
  const [telegram, setTelegram] = useState(project?.telegram ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(project?.website_url ?? "");
  const [price, setPrice] = useState(project?.price?.toString() ?? "");
  const [workStatus, setWorkStatus] = useState<WorkStatus>(project?.work_status ?? "planned");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(project?.payment_status ?? "unpaid");
  const [siteCreatedAt, setSiteCreatedAt] = useState(toInputDate(project?.site_created_at ?? null));
  const [paidAt, setPaidAt] = useState(toInputDate(project?.paid_at ?? null));
  const [notes, setNotes] = useState(project?.notes ?? "");
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [contractUrl, setContractUrl] = useState(project?.contract_url ?? null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const name = projectName.trim();
    if (!name) return setError("Укажи название проекта.");
    if (websiteUrl && !/^https?:\/\//i.test(websiteUrl)) return setError("Ссылка на сайт должна начинаться с http:// или https://");

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return setError("Нужна авторизация.");
    }

    let urlToSave: string | null = contractUrl;
    const payload = {
      client_name: name,
      phone: phone.trim() || null,
      telegram: telegram.trim() || null,
      website_url: websiteUrl.trim() || null,
      price: parseFloat(price) || 0,
      work_status: workStatus,
      payment_status: paymentStatus,
      site_created_at: siteCreatedAt || null,
      paid_at: paidAt || null,
      notes: notes.trim() || null,
    };

    try {
      if (project?.id) {
        if (contractFile) {
          const path = `${user.id}/${project.id}/${contractFile.name}`;
          const { error: uploadErr } = await supabase.storage.from(CONTRACTS_BUCKET).upload(path, contractFile, { upsert: true });
          if (!uploadErr) urlToSave = path;
        }
        const { error: updateErr } = await supabase.from("projects").update({ ...payload, contract_url: urlToSave }).eq("id", project.id);
        if (updateErr) throw updateErr;
        hapticSuccess();
        router.push(`/projects/${project.id}`);
      } else {
        const { data: inserted, error: insertErr } = await supabase.from("projects").insert({ ...payload, contract_url: null }).select("id").single();
        if (insertErr) throw insertErr;
        if (contractFile) {
          const path = `${user.id}/${inserted.id}/${contractFile.name}`;
          await supabase.storage.from(CONTRACTS_BUCKET).upload(path, contractFile, { upsert: true });
          await supabase.from("projects").update({ contract_url: path }).eq("id", inserted.id);
        }
        hapticSuccess();
        router.push(`/projects/${inserted.id}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-32">
      <PageSection title={project ? "Редактирование" : "Новый проект"} tonal>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Название проекта / клиент" value={projectName} onChange={(e) => setProjectName(e.target.value)} required placeholder="RC Dental" autoFocus autoComplete="organization" />
          <Input label="Сумма (₸)" type="number" min={0} step={1} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1350000" inputMode="numeric" />
        </div>
      </PageSection>

      <PageSection title="Контакты">
        <div className="flex flex-wrap gap-3">
          <ContactImportButton onPick={(contact) => {
            if (contact.name && !projectName) setProjectName(contact.name);
            if (contact.tel) setPhone(contact.tel);
          }} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Телефон" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 777 123 45 67" autoComplete="tel" inputMode="tel" />
          <Input label="Telegram (необязательно)" value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="@username" autoComplete="username" />
        </div>
        <Input label="Сайт" type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://example.com" inputMode="url" autoComplete="url" />
        <ContactActions name={projectName || "contact"} phone={phone} telegram={telegram} website={websiteUrl} note={notes} compact />
      </PageSection>

      <PageSection title="Статусы">
        <div className="grid gap-4 md:grid-cols-2">
          <Select label="Статус работы" options={workOptions} value={workStatus} onChange={(e) => setWorkStatus(e.target.value as WorkStatus)} />
          <Select label="Статус оплаты" options={paymentOptions} value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)} />
          <Input label="Дата оплаты" type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
          <Input label="Дата создания сайта" type="date" value={siteCreatedAt} onChange={(e) => setSiteCreatedAt(e.target.value)} />
        </div>
      </PageSection>

      <PageSection title="Файлы и заметки">
        <FileUpload label="Договор" value={contractFile} currentUrl={contractUrl} onChange={(file) => {
          setContractFile(file);
          if (!file) setContractUrl(null);
        }} />
        <Textarea label="Заметки" value={notes} onChange={setNotes} placeholder="Нюансы по проекту" />
      </PageSection>

      {error ? <p className="md-typescale-body-medium text-[var(--sys-color-role-error)]">{error}</p> : null}

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-[var(--sys-color-role-outline-variant)] bg-[var(--sys-surface-backdrop-strong)] px-4 py-3 backdrop-blur-xl md:-mx-6 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="text" onClick={() => router.back()}>Назад</Button>
          <Button type="submit" disabled={loading}>{loading ? "Сохранение…" : project ? "Сохранить" : "Создать"}</Button>
        </div>
      </div>
    </form>
  );
}
