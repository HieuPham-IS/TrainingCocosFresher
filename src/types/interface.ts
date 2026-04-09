export interface InventoryBatch{
  id: string;
  productId: string;
  quantity: number;
  costPrice: number;
  importedAt: Date;
  createdBy: string;
}

export interface Transaction{
  id: string;
  type: "INCOME";
  category: "SALES" | "PURCHASE" | "SALARY" | "RENT" | "MARKETING" | "REFUND";
  amount: number;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "CARD" | "E_WALLET";
  referenceId: string;
  createdBy: string;
  createdAt: Date;
}

export interface Expense{
  id: string;
  type: "FIXED" | "VARIABLE";
  amount: number;
  description: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "CARD" | "E_WALLET";
  createdBy: string;
  date: Date;
}

export interface PeriodReport{
  revenue: number;
  cogs: number;
  expenses: number;
  grossProfit: number;
  netProfit: number;
  momGrowth: number;
  yoyGrowth: number;
  totalOrders: number;
  aov: number;
}