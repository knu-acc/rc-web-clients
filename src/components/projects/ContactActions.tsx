"use client";

import { getPhoneUrl, getTelegramUrl, getWhatsAppUrl } from "@/lib/contact-utils";

interface ContactActionsProps {
  name: string;
  phone?: string | null;
  telegram?: string | null;
  website?: string | null;
  note?: string | null;
  compact?: boolean;
}

export default function ContactActions({ phone, telegram, compact = false }: ContactActionsProps) {
  const phoneUrl = getPhoneUrl(phone);
  const whatsappUrl = getWhatsAppUrl(phone);
  const telegramUrl = getTelegramUrl(telegram);

  const baseClass = compact
    ? "min-h-10 px-4 rounded-[var(--shape-full)] md-typescale-label-medium"
    : "min-h-11 px-5 rounded-[var(--shape-full)] md-typescale-label-large";

  return (
    <div className="flex flex-wrap gap-2">
      {phoneUrl ? <a href={phoneUrl} className={`${baseClass} inline-flex items-center bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]`}>Позвонить</a> : null}
      {whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noreferrer" className={`${baseClass} inline-flex items-center bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]`}>WhatsApp</a> : null}
      {telegramUrl ? <a href={telegramUrl} target="_blank" rel="noreferrer" className={`${baseClass} inline-flex items-center bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)]`}>Telegram</a> : null}
    </div>
  );
}
