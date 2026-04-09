export interface PurchaseItem {
  productId: string;
  quantity: number;
  costPrice: number;
}

export interface Purchase {
  id: string;
  supplier: string;
  staffId: string;
  items: PurchaseItem[];
  totalCost: number;
  createdAt: Date;
}