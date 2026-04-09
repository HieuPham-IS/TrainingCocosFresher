export interface Invoice {
  id: string;
  customerId?: string;
  staffId: string;
  items: InvoiceItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'E_WALLET';
  createdAt: Date;
}

export interface InvoiceItem {
  productId: string;
  quantity: number;
  price: number;
  cost: number;
}