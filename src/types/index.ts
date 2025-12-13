export type AppRole = 'user' | 'partner' | 'admin';

export interface Profile {
  id: string;
  display_name: string | null;
  monthly_available_budget: number;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface PartnerConfig {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  amazon_tag: string | null;
  kabum_code: string | null;
  terabyte_code: string | null;
  aliexpress_code: string | null;
  mercadolivre_code: string | null;
  total_clicks: number;
  unique_visitors: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreOption {
  store_name: string;
  store_slug: string;
  price_cash: number;
  price_pix?: number;
  price_installment?: number;
  installments?: number;
  affiliate_link: string;
}

export interface Item {
  id: string;
  project_id: string;
  name: string;
  category: string | null;
  status: string;
  ai_recommendation: string | null;
  stores_json: StoreOption[];
  created_at: string;
  updated_at: string;
}

export interface ClickLog {
  id: string;
  partner_id: string | null;
  item_name: string | null;
  store_name: string | null;
  category: string | null;
  created_at: string;
}
