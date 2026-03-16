/** Site access code — required before Supabase login */
export const SITE_PASSWORD = "4149";

/** Storage bucket name for contract files */
export const CONTRACTS_BUCKET = "contracts";

/** Work status options (DB: planned | in_progress | review | done) */
export const WORK_STATUS_OPTIONS = [
  { value: "planned", label: "В планах" },
  { value: "in_progress", label: "В работе" },
  { value: "review", label: "На согласовании" },
  { value: "done", label: "Готово" },
] as const;

/** Payment status options */
export const PAYMENT_STATUS_OPTIONS = [
  { value: "unpaid", label: "Не оплачено" },
  { value: "prepaid", label: "Предоплата" },
  { value: "paid", label: "Оплачено полностью" },
] as const;

/** Allowed MIME types for contract uploads */
export const CONTRACT_ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
