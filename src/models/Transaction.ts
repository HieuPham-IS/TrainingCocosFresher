import { Transaction } from '../types/interface'

export class TransactionModel implements Transaction {
  id: string;
  type: "INCOME";
  category: "SALES" | "PURCHASE" | "SALARY" | "RENT" | "MARKETING" | "REFUND";
  amount: number;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "CARD" | "E_WALLET";
  referenceId: string;
  createdBy: string;
  createdAt: Date;

  constructor(data: Transaction) {
    this.id = data.id;
    this.type = data.type;
    this.category = data.category;
    this.amount = data.amount;
    this.paymentMethod = data.paymentMethod;
    this.referenceId = data.referenceId;
    this.createdBy = data.createdBy;
    this.createdAt = data.createdAt;
  }

}