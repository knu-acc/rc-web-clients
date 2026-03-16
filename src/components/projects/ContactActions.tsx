"use client";

import { getPhoneUrl, getTelegramUrl, getVCardData, getWhatsAppUrl } from "@/lib/contact-utils";

interface ContactActionsProps {
  name: string;
  phone?: string | null;
  telegram?: string | null;
  website?: string | null;
  note?: string | null;
  compact?: boolean;
}

export default function ContactActions({
  name,
  phone,
  telegram,
  website,
  note,
  compact = false,
}: ContactActionsProps) {
  const phoneUrl = getPhoneUrl(phone);
  const whatsappUrl = getWhatsAppUrl(phone);
  const telegramUrl = getTelegramUrl(telegram);

  const downloadVCard = () => {
    const content = getVCardData({ name, phone, telegram, website, note });
    const blob = new Blob([content], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/[^a-zA-Zа-яА-Я0-9_-]+/g, "-") || "contact"}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const baseClass = compact
    ? "min-h-10 px-3 rounded-full md-typescale-label-medium"
    : "min-h-11 px-4 rounded-full md-typescale-label-large";

  return (
    <div className="flex flex-wrap gap-2">
      {phoneUrl ? (
        <a href={phoneUrl} className={`${baseClass} inline-flex items-center bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]`}>
          Позвонить
        </a>
      ) : null}
      {whatsappUrl ? (
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className={`${baseClass} inline-flex items-center bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]`}>
          WhatsApp
        </a>
      ) : null}
      {telegramUrl ? (
        <a href={telegramUrl} target="_blank" rel="noreferrer" className={`${baseClass} inline-flex items-center bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)]`}>
          Telegram
        </a>
      ) : null}
      <button type="button" onClick={downloadVCard} className={`${baseClass} inline-flex items-center border border-[var(--color-outline)] bg-[var(--color-surface)] text-[var(--color-on-surface)]`}>
        В контакты
      </button>
    </div>
  );
}
