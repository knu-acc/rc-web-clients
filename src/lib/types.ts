export type WorkStatus = "planned" | "in_progress" | "review" | "done";
export type PaymentStatus = "unpaid" | "prepaid" | "paid";

export interface Project {
  id: string;
  user_id: string;
  client_name: string;
  phone: string | null;
  telegram: string | null;
  website_url: string | null;
  price: number;
  contract_url: string | null;
  work_status: WorkStatus;
  payment_status: PaymentStatus;
  site_created_at: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
