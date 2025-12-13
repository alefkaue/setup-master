export interface User {
  id: string;
  email: string;
  name: string;
  monthlyIncome?: number;
  createdAt: Date;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  projectId: string;
  name: string;
  category: ItemCategory;
  targetBudget?: number;
  selectedOffer?: StoreOffer;
  offers: StoreOffer[];
  createdAt: Date;
}

export interface StoreOffer {
  id: string;
  store: StoreName;
  storeLogo: string;
  productName: string;
  pixPrice: number;
  installmentPrice: number;
  installments: number;
  installmentValue: number;
  url: string;
  inStock: boolean;
}

export type StoreName = 'Amazon' | 'Kabum' | 'Pichau' | 'Terabyte' | 'AliExpress' | 'Mercado Livre';

export type ItemCategory = 
  | 'GPU' 
  | 'CPU' 
  | 'Motherboard' 
  | 'RAM' 
  | 'Storage' 
  | 'PSU' 
  | 'Case' 
  | 'Cooling' 
  | 'Monitor' 
  | 'Peripheral' 
  | 'Other';

export interface DashboardStats {
  totalProjectValue: number;
  monthlyInstallments: number;
  pixTotal: number;
  incomeCommitment: number;
  itemCount: number;
}
