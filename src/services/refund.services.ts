import { RefundModel } from "../models/Refund";
import { readData, writeData } from "../utils/fileManager";
import { IdGenerator } from "../utils/id-generator";
import { Refund } from "../types/return.interface";
import { TransactionServices } from "./transaction.services";
import { InvoiceServices } from "./invoice.services";

export class RefundServices{
    private refunds: RefundModel [] = [];
    private path: string = "./data/refund.json";
    private transactionServices: TransactionServices;
    private invoiceServices: InvoiceServices;

    private generateId(): string {
        return IdGenerator.generatePrefixedId(this.refunds, "R");
    }

    constructor(transactionServices: TransactionServices, invoiceServices: InvoiceServices){
        this.transactionServices = transactionServices;
        this.invoiceServices = invoiceServices;
        const data = readData(this.path);
        if (!data || data.length === 0) {
            this.refunds = [];
            writeData(this.path, JSON.stringify(this.refunds, null, 2));
            console.log("Refund file created");
        } else {
            this.refunds = data.map((refunds: any) => new RefundModel(refunds));
            console.log("Refund file loaded");
        }
    }

    createRefund(data: Omit<Refund, 'id'>) {
        const newRefund = new RefundModel({
            ...data,
            id: this.generateId()
        });

        this.refunds.push(newRefund);
        writeData(this.path, JSON.stringify(this.refunds, null, 2));

        // Create transaction for refund
        this.transactionServices.createTransaction(
            "REFUND",
            newRefund.refundAmount,
            "BANK_TRANSFER",
            newRefund.id,
            newRefund.createdBy
        );

        console.log("Refund created successfully");
        return newRefund;
    }

    deleteRefund(id: string) {
        const index = this.refunds.findIndex(ref => ref.id === id);
        if (index === -1) {
            console.log("Refund not found");
            return false;
        }

        this.refunds.splice(index, 1);
        writeData(this.path, JSON.stringify(this.refunds, null, 2));
        console.log("Refund deleted successfully");
        return true;
    }

    getAllRefunds(): RefundModel[] {
        return this.refunds;
    }

    getRefundById(id: string): RefundModel | undefined {
        return this.refunds.find(ref => ref.id === id);
    }

    getRefundsByInvoiceId(invoiceId: string): RefundModel[] {
        return this.refunds.filter(ref => ref.invoiceId === invoiceId);
    }

    getRefundsByCreatedBy(createdBy: string): RefundModel[] {
        return this.refunds.filter(ref => ref.createdBy === createdBy);
    }

    updateRefund(id: string, updates: Partial<Omit<Refund, 'id' | 'createdAt' | 'createdBy'>>) {
        const refund = this.refunds.find(ref => ref.id === id);
        if (!refund) {
            console.log("Refund not found");
            return false;
        }

        Object.assign(refund, updates);
        writeData(this.path, JSON.stringify(this.refunds, null, 2));
        console.log("Refund updated successfully");
        return true;
    }

    getTotalRefundAmount(): number {
        return this.refunds.reduce((sum, ref) => sum + ref.refundAmount, 0);
    }

    getRefundsByDateRange(startDate: Date, endDate: Date): RefundModel[] {
        return this.refunds.filter(ref => 
            ref.createdAt >= startDate && ref.createdAt <= endDate
        );
    }

    getAverageRefundAmount(): number {
        if (this.refunds.length === 0) return 0;
        return this.getTotalRefundAmount() / this.refunds.length;
    }
}