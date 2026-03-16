export function normalizePhone(phone?: string | null): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (!cleaned) return null;
  if (cleaned.startsWith("+")) return cleaned;
  if (cleaned.startsWith("8") && cleaned.length === 11) return `+7${cleaned.slice(1)}`;
  return cleaned.startsWith("7") ? `+${cleaned}` : `+${cleaned}`;
}

export function getWhatsAppUrl(phone?: string | null): string | null {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  return `https://wa.me/${normalized.replace(/\D/g, "")}`;
}

export function getPhoneUrl(phone?: string | null): string | null {
  const normalized = normalizePhone(phone);
  return normalized ? `tel:${normalized}` : null;
}

export function getTelegramUrl(telegram?: string | null): string | null {
  if (!telegram) return null;
  const value = telegram.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const username = value.replace(/^@/, "");
  return username ? `https://t.me/${username}` : null;
}

export function getVCardData(params: {
  name: string;
  phone?: string | null;
  telegram?: string | null;
  website?: string | null;
  note?: string | null;
}) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(params.name)}`,
  ];

  const phone = normalizePhone(params.phone);
  if (phone) lines.push(`TEL;TYPE=CELL:${escapeVCard(phone)}`);
  if (params.telegram) lines.push(`X-SOCIALPROFILE;TYPE=telegram:${escapeVCard(params.telegram)}`);
  if (params.website) lines.push(`URL:${escapeVCard(params.website)}`);
  if (params.note) lines.push(`NOTE:${escapeVCard(params.note)}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

function escapeVCard(value: string) {
  return value.replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
