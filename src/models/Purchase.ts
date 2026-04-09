import { Purchase, PurchaseItem } from '../types/purchase.interface'

export class PurchaseModel implements Purchase {
  id: string;
  supplier: string;
  staffId: string;
  items: PurchaseItem[];
  totalCost: number;
  createdAt: Date;

  constructor(data: Purchase) {
    this.id = data.id;
    this.supplier = data.supplier;
    this.staffId = data.staffId;
    this.items = data.items;
    this.totalCost = data.totalCost;
    this.createdAt = data.createdAt;
  }

  
}