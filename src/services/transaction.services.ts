import { readData, writeData } from "../utils/fileManager";
import { Transaction } from '../types/interface'
import { TransactionModel } from "../models/Transaction";

export class TransactionServices{
    private transactions: TransactionModel[] = [];
    private path: string = "./data/transactions.json";

    private generateId(): string {
        if (this.transactions.length === 0) return "1";

        const max = Math.max(
          ...this.transactions.map(trans => parseInt(trans.id))
        );

        return (max + 1).toString();
      }

    constructor(){
        const data = readData(this.path);
        if(!data || data.length === 0){
            this.transactions = [];
            writeData(this.path, JSON.stringify(this.transactions, null,2));
            console.log("Transaction file created");
        } else{
            this.transactions = data.map((trans: any) => new TransactionModel(trans));
            console.log("Transaction file loaded");
        }
    }

    createTransaction(
        category: "SALES" | "PURCHASE" | "SALARY" | "RENT" | "MARKETING" | "REFUND",
        amount: number,
        paymentMethod: "CASH" | "BANK_TRANSFER" | "CARD" | "E_WALLET",
        referenceId: string,
        createdBy: string
    ) {
        const newTransaction = new TransactionModel({
            id: this.generateId(),
            type: "INCOME",
            category,
            amount,
            paymentMethod,
            referenceId,
            createdBy,
            createdAt: new Date()
        });

        this.transactions.push(newTransaction);
        writeData(this.path, JSON.stringify(this.transactions, null, 2));
        console.log(`Transaction created: ${category} - ${amount}`);
        return newTransaction;
    }

    createManualTransaction(
        category: "SALES" | "PURCHASE" | "SALARY" | "RENT" | "MARKETING" | "REFUND",
        amount: number,
        paymentMethod: "CASH" | "BANK_TRANSFER" | "CARD" | "E_WALLET",
        description: string,
        createdBy: string
    ) {
        const newTransaction = new TransactionModel({
            id: this.generateId(),
            type: "INCOME",
            category,
            amount,
            paymentMethod,
            referenceId: description, 
            createdBy,
            createdAt: new Date()
        });

        this.transactions.push(newTransaction);
        writeData(this.path, JSON.stringify(this.transactions, null, 2));
        console.log(`Manual transaction created: ${category} - ${amount}`);
        return newTransaction;
    }

    deleteTransaction(id: string) {
        const index = this.transactions.findIndex(trans => trans.id === id);
        if (index === -1) {
            console.log("Transaction not found");
            return false;
        }

        this.transactions.splice(index, 1);
        writeData(this.path, JSON.stringify(this.transactions, null, 2));
        console.log("Transaction deleted successfully");
        return true;
    }

    updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt' | 'createdBy'>>) {
        const transaction = this.transactions.find(trans => trans.id === id);
        if (!transaction) {
            console.log("Transaction not found");
            return false;
        }

        Object.assign(transaction, updates);
        writeData(this.path, JSON.stringify(this.transactions, null, 2));
        console.log("Transaction updated successfully");
        return true;
    }

    getAllTransactions(): TransactionModel[] {
        return this.transactions;
    }

    getTransactionById(id: string): TransactionModel | undefined {
        return this.transactions.find(trans => trans.id === id);
    }

    getTransactionsByCategory(category: string): TransactionModel[] {
        return this.transactions.filter(trans => trans.category === category);
    }

    getTransactionsByStaff(staffId: string): TransactionModel[] {
        return this.transactions.filter(trans => trans.createdBy === staffId);
    }

    getTransactionsByDateRange(startDate: Date, endDate: Date): TransactionModel[] {
        return this.transactions.filter(trans => {
            const transDate = new Date(trans.createdAt);
            return transDate >= startDate && transDate <= endDate;
        });
    }

    getTransactionsByPaymentMethod(method: string): TransactionModel[] {
        return this.transactions.filter(trans => trans.paymentMethod === method);
    }

    getTotalByCategory(category: string): number {
        return this.getTransactionsByCategory(category).reduce((sum, trans) => {
            if (category === "REFUND") {
                return sum - trans.amount; 
            }
            return sum + trans.amount;
        }, 0);
    }

    getTotalByDateRange(startDate: Date, endDate: Date): number {
        return this.getTransactionsByDateRange(startDate, endDate).reduce((sum, trans) => {
            if (trans.category === "REFUND") {
                return sum - trans.amount;
            }
            return sum + trans.amount;
        }, 0);
    }

    getSummary() {
        const summary = {
            totalSales: this.getTotalByCategory("SALES"),
            totalRefunds: this.getTotalByCategory("REFUND"),
            totalPurchases: this.getTotalByCategory("PURCHASE"),
            totalSalaries: this.getTotalByCategory("SALARY"),
            totalRent: this.getTotalByCategory("RENT"),
            totalMarketing: this.getTotalByCategory("MARKETING"),
        };

        summary.totalSales = summary.totalSales - summary.totalRefunds;
        return summary;
    }

    getMonthlyReport(year: number, month: number) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const monthlyTransactions = this.getTransactionsByDateRange(startDate, endDate);

        const report = {
            period: `${year}-${month.toString().padStart(2, '0')}`,
            totalIncome: 0,
            totalExpenses: 0,
            netIncome: 0,
            transactions: monthlyTransactions.length,
            breakdown: {
                sales: 0,
                refunds: 0,
                purchases: 0,
                salaries: 0,
                rent: 0,
                marketing: 0
            }
        };

        monthlyTransactions.forEach(trans => {
            switch (trans.category) {
                case "SALES":
                    report.breakdown.sales += trans.amount;
                    report.totalIncome += trans.amount;
                    break;
                case "REFUND":
                    report.breakdown.refunds += trans.amount;
                    report.totalIncome -= trans.amount;
                    break;
                case "PURCHASE":
                    report.breakdown.purchases += trans.amount;
                    report.totalExpenses += trans.amount;
                    break;
                case "SALARY":
                    report.breakdown.salaries += trans.amount;
                    report.totalExpenses += trans.amount;
                    break;
                case "RENT":
                    report.breakdown.rent += trans.amount;
                    report.totalExpenses += trans.amount;
                    break;
                case "MARKETING":
                    report.breakdown.marketing += trans.amount;
                    report.totalExpenses += trans.amount;
                    break;
            }
        });

        report.netIncome = report.totalIncome - report.totalExpenses;
        return report;
    }

    getYearlyReport(year: number) {
        const yearlyReport = {
            year,
            totalIncome: 0,
            totalExpenses: 0,
            netIncome: 0,
            monthlyReports: [] as any[]
        };

        for (let month = 1; month <= 12; month++) {
            const monthlyReport = this.getMonthlyReport(year, month);
            yearlyReport.monthlyReports.push(monthlyReport);
            yearlyReport.totalIncome += monthlyReport.totalIncome;
            yearlyReport.totalExpenses += monthlyReport.totalExpenses;
        }

        yearlyReport.netIncome = yearlyReport.totalIncome - yearlyReport.totalExpenses;
        return yearlyReport;
    }
}