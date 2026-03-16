"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Project, WorkStatus, PaymentStatus } from "@/lib/types";
import {
  WORK_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  CONTRACTS_BUCKET,
} from "@/lib/constants";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { SelectOption } from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import Textarea from "@/components/ui/Textarea";
import PageSection from "@/components/material/PageSection";

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
    if (!name) {
      setError("Укажите название проекта или имя клиента.");
      return;
    }

    if (websiteUrl && !/^https?:\/\//i.test(websiteUrl)) {
      setError("Ссылка на сайт должна начинаться с http:// или https://");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Нужна авторизация.");
      setLoading(false);
      return;
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

        const { error: updateErr } = await supabase
          .from("projects")
          .update({ ...payload, contract_url: urlToSave })
          .eq("id", project.id);

        if (updateErr) throw updateErr;
        router.push(`/projects/${project.id}`);
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from("projects")
          .insert({ ...payload, contract_url: null })
          .select("id")
          .single();

        if (insertErr) throw insertErr;

        if (contractFile) {
          const path = `${user.id}/${inserted.id}/${contractFile.name}`;
          await supabase.storage.from(CONTRACTS_BUCKET).upload(path, contractFile, { upsert: true });
          await supabase.from("projects").update({ contract_url: path }).eq("id", inserted.id);
        }

        router.push(`/projects/${inserted.id}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    setContractFile(file);
    if (!file) setContractUrl(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-32">
      <PageSection
        title={project ? "Редактирование проекта" : "Новый проект"}
        description="Структура формы разделена по смыслу: проект, связь, статусы и документы. Телефон и Telegram — отдельные поля, не один и тот же контакт."
        tonal
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Название проекта / клиент"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            placeholder="Например: RC Dental"
            hint="Сейчас сохраняется в поле client_name. Позже его можно переименовать в схеме Supabase без переписывания всей формы."
          />
          <Input
            label="Сумма проекта (₸)"
            type="number"
            min={0}
            step={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1350000"
            hint="Если сумма пока неизвестна, оставь 0 и обнови позже."
          />
        </div>
      </PageSection>

      <PageSection
        title="Контакты и ссылка"
        description="Контакты не смешиваются: телефон отдельно, Telegram отдельно. Так данные проще обновлять и искать."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Телефон"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 777 123 45 67"
            hint="Только номер телефона клиента или менеджера."
          />
          <Input
            label="Telegram"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            placeholder="@username"
            hint="Только Telegram, не номер телефона."
          />
        </div>
        <Input
          label="Ссылка на готовый сайт"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://example.com"
          hint="Если сайт ещё не опубликован — оставь пустым."
        />
      </PageSection>

      <PageSection
        title="Статусы и даты"
        description="Основные операционные поля вынесены в отдельный блок, чтобы их было удобно обновлять без прокрутки по всей форме."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Статус работы"
            options={workOptions}
            value={workStatus}
            onChange={(e) => setWorkStatus(e.target.value as WorkStatus)}
          />
          <Select
            label="Статус оплаты"
            options={paymentOptions}
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
          />
          <Input
            label="Дата оплаты"
            type="date"
            value={paidAt}
            onChange={(e) => setPaidAt(e.target.value)}
          />
          <Input
            label="Дата создания сайта"
            type="date"
            value={siteCreatedAt}
            onChange={(e) => setSiteCreatedAt(e.target.value)}
          />
        </div>
      </PageSection>

      <PageSection
        title="Документы и заметки"
        description="Редкие и тяжёлые поля оставлены внизу, чтобы основная часть ввода оставалась быстрой."
      >
        <FileUpload
          label="Договор (PDF или изображение)"
          value={contractFile}
          currentUrl={contractUrl}
          onChange={handleFileChange}
        />
        <Textarea
          label="Заметки"
          value={notes}
          onChange={setNotes}
          placeholder="Что важно помнить по проекту, по клиенту, по дедлайнам или по оплате…"
          hint="Поле для свободного текста. Сюда удобно складывать все нюансы, пока отдельные поля не вынесены в Supabase."
        />
      </PageSection>

      {error ? <p className="md-typescale-body-medium text-[var(--color-error)]">{error}</p> : null}

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-[var(--color-outline-variant)] bg-[color-mix(in_srgb,var(--color-surface)_94%,transparent)] px-4 py-3 backdrop-blur-xl md:-mx-6 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="text" onClick={() => router.back()}>
            Назад
          </Button>
          <Button type="submit" variant="outlined">
            {project ? "Сохранить изменения" : "Проверить и сохранить"}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Сохранение…" : project ? "Обновить проект" : "Создать проект"}
          </Button>
        </div>
      </div>
    </form>
  );
}
