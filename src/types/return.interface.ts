export interface ReturnItem {
  productId: string;
  quantity: number;
}

export interface Refund {
  id: string;
  invoiceId: string;
  items: ReturnItem[];
  refundAmount: number;
  createdBy: string;
  createdAt: Date;
}