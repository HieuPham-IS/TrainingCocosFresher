import { Expense } from '../types/interface'

export class ExpenseModel implements Expense {
  id: string;
  type: "FIXED" | "VARIABLE";
  amount: number;
  description: string;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "CARD" | "E_WALLET";
  createdBy: string;
  date: Date;

  constructor(data: Expense) {
    this.id = data.id;
    this.type = data.type;
    this.amount = data.amount;
    this.description = data.description;
    this.paymentMethod = data.paymentMethod;
    this.createdBy = data.createdBy;
    this.date = data.date;
  }


}