import { Invoice, InvoiceItem } from '../types/invoice.interface'

export class InvoiceModel implements Invoice {
  id: string;
  customerId?: string;
  staffId: string;
  items: InvoiceItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'E_WALLET';
  createdAt: Date;

  constructor(data: Invoice) {
    this.id = data.id;
    this.customerId = data.customerId;
    this.staffId = data.staffId;
    this.items = data.items;
    this.totalAmount = data.totalAmount;
    this.discount = data.discount;
    this.finalAmount = data.finalAmount;
    this.paymentMethod = data.paymentMethod;
    this.createdAt = data.createdAt;
  }

}