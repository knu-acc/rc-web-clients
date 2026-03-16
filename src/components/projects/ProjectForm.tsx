"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";
import type { WorkStatus, PaymentStatus } from "@/lib/types";
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

interface ProjectFormProps {
  project?: Project | null;
}

const workOptions: SelectOption[] = WORK_STATUS_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}));
const paymentOptions: SelectOption[] = PAYMENT_STATUS_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}));

function toInputDate(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [clientName, setClientName] = useState(project?.client_name ?? "");
  const [phone, setPhone] = useState(project?.phone ?? "");
  const [telegram, setTelegram] = useState(project?.telegram ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(project?.website_url ?? "");
  const [price, setPrice] = useState(project?.price?.toString() ?? "");
  const [workStatus, setWorkStatus] = useState<WorkStatus>(
    project?.work_status ?? "planned"
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    project?.payment_status ?? "unpaid"
  );
  const [siteCreatedAt, setSiteCreatedAt] = useState(
    toInputDate(project?.site_created_at ?? null)
  );
  const [paidAt, setPaidAt] = useState(toInputDate(project?.paid_at ?? null));
  const [notes, setNotes] = useState(project?.notes ?? "");
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [contractUrl, setContractUrl] = useState(project?.contract_url ?? null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const name = clientName.trim();
    if (!name) {
      setError("Укажите имя клиента или название проекта.");
      return;
    }
    let urlToSave: string | null = contractUrl;
    if (websiteUrl && !/^https?:\/\//i.test(websiteUrl)) {
      setError("Ссылка на сайт должна начинаться с http:// или https://");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Нужна авторизация.");
      setLoading(false);
      return;
    }
    const priceNum = parseFloat(price) || 0;
    const payload = {
      client_name: name,
      phone: phone.trim() || null,
      telegram: telegram.trim() || null,
      website_url: websiteUrl.trim() || null,
      price: priceNum,
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
          const { error: uploadErr } = await supabase.storage
            .from(CONTRACTS_BUCKET)
            .upload(path, contractFile, { upsert: true });
          if (!uploadErr) urlToSave = path;
        }
        const { error: updateErr } = await supabase
          .from("projects")
          .update({ ...payload, contract_url: urlToSave })
          .eq("id", project.id);
        if (updateErr) throw updateErr;
        router.push("/projects");
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from("projects")
          .insert({ ...payload, contract_url: null })
          .select("id")
          .single();
        if (insertErr) throw insertErr;
        const newId = inserted.id;
        if (contractFile) {
          const path = `${user.id}/${newId}/${contractFile.name}`;
          await supabase.storage
            .from(CONTRACTS_BUCKET)
            .upload(path, contractFile, { upsert: true });
          await supabase
            .from("projects")
            .update({ contract_url: path })
            .eq("id", newId);
        }
        router.push("/projects");
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto pb-24">
      <section className="rounded-[16px] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] p-4 space-y-4">
        <h2 className="md-typescale-title-medium">Основное</h2>
        <Input
          label="Имя клиента / Название проекта"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
          placeholder="Например: Green Studio"
        />
        <Input
          label="Цена (₸)"
          type="number"
          min={0}
          step={1}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="1350000"
        />
      </section>

      <section className="rounded-[16px] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] p-4 space-y-4">
        <h2 className="md-typescale-title-medium">Контакты</h2>
        <Input
          label="Телефон"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 777 123 45 67"
        />
        <Input
          label="Telegram"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
          placeholder="@username"
        />
      </section>

      <section className="rounded-[16px] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] p-4 space-y-4">
        <h2 className="md-typescale-title-medium">Статусы и оплата</h2>
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
      </section>

      <details className="rounded-[16px] border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] p-4">
        <summary className="cursor-pointer md-typescale-title-medium min-h-[44px] flex items-center">
          Дополнительные поля
        </summary>
        <div className="mt-4 space-y-4">
          <Input
            label="Ссылка на готовый сайт"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://…"
          />
          <Input
            label="Дата создания сайта"
            type="date"
            value={siteCreatedAt}
            onChange={(e) => setSiteCreatedAt(e.target.value)}
          />
          <FileUpload
            label="Договор (PDF или изображение)"
            value={contractFile}
            currentUrl={contractUrl}
            onChange={handleFileChange}
          />
          <div>
            <label className="block md-typescale-label-large text-[var(--color-on-surface)] mb-1">
              Заметки
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Нюансы по проекту…"
              className="w-full px-4 py-3 rounded-[var(--md-sys-shape-corner-extra-small)] border border-[var(--color-outline)] bg-[var(--color-surface)] text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] md-typescale-body-large resize-y min-h-[100px]"
            />
          </div>
        </div>
      </details>

      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}

      <div className="sticky bottom-0 z-10 -mx-4 px-4 py-3 bg-[var(--color-surface)] border-t border-[var(--color-outline-variant)]">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Button
            type="button"
            variant="outlined"
            onClick={() => router.back()}
            className="flex-1"
          >
            Отмена
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Сохранение…" : "Сохранить"}
          </Button>
        </div>
      </div>
    </form>
  );
}
