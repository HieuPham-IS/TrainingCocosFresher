import { readData, writeData } from "../utils/fileManager";
import { IdGenerator } from "../utils/id-generator";
import { Expense } from '../types/interface';
import { ExpenseModel } from "../models/Expense";

export class ExpenseServices {
    private expenses: ExpenseModel[] = [];
    private path: string = "./data/expenses.json";

    private generateId(): string {
        return IdGenerator.generateSimpleId(this.expenses);
    }

    constructor() {
        const data = readData(this.path);
        if (!data || data.length === 0) {
            this.expenses = [];
            writeData(this.path, JSON.stringify(this.expenses, null, 2));
            console.log("Expense file created");
        } else {
            this.expenses = data.map((exp: any) => new ExpenseModel(exp));
            console.log("Expense file loaded");
        }
    }

    createExpense(data: Omit<Expense, 'id'>) {
        const newExpense = new ExpenseModel({
            ...data,
            id: this.generateId()
        });

        this.expenses.push(newExpense);
        writeData(this.path, JSON.stringify(this.expenses, null, 2));
        console.log("Expense created successfully");
        return newExpense;
    }

    deleteExpense(id: string) {
        const index = this.expenses.findIndex(exp => exp.id === id);
        if (index === -1) {
            console.log("Expense not found");
            return false;
        }

        this.expenses.splice(index, 1);
        writeData(this.path, JSON.stringify(this.expenses, null, 2));
        console.log("Expense deleted successfully");
        return true;
    }

    getAllExpenses(): ExpenseModel[] {
        return this.expenses;
    }

    getExpenseById(id: string): ExpenseModel | undefined {
        return this.expenses.find(exp => exp.id === id);
    }

    getExpensesByType(type: "FIXED" | "VARIABLE"): ExpenseModel[] {
        return this.expenses.filter(exp => exp.type === type);
    }

    getExpensesByPaymentMethod(method: "CASH" | "BANK_TRANSFER" | "CARD" | "E_WALLET"): ExpenseModel[] {
        return this.expenses.filter(exp => exp.paymentMethod === method);
    }

    updateExpense(id: string, updates: Partial<Omit<Expense, 'id'>>) {
        const expense = this.expenses.find(exp => exp.id === id);
        if (!expense) {
            console.log("Expense not found");
            return false;
        }

        Object.assign(expense, updates);
        writeData(this.path, JSON.stringify(this.expenses, null, 2));
        console.log("Expense updated successfully");
        return true;
    }

    getTotalExpensesByType(type: "FIXED" | "VARIABLE"): number {
        return this.expenses
            .filter(exp => exp.type === type)
            .reduce((sum, exp) => sum + exp.amount, 0);
    }

    getTotalExpensesByDate(startDate: Date, endDate: Date): number {
        return this.expenses
            .filter(exp => exp.date >= startDate && exp.date <= endDate)
            .reduce((sum, exp) => sum + exp.amount, 0);
    }

    getTotalAllExpenses(): number {
        return this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    }
}
