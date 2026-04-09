import { Refund, ReturnItem } from '../types/return.interface'

export class RefundModel implements Refund {
  id: string;
  invoiceId: string;
  items: ReturnItem[];
  refundAmount: number;
  createdBy: string;
  createdAt: Date;

  constructor(data: Refund) {
    this.id = data.id;
    this.invoiceId = data.invoiceId;
    this.items = data.items;
    this.refundAmount = data.refundAmount;
    this.createdBy = data.createdBy;
    this.createdAt = data.createdAt;
  }



}