import { readData, writeData } from "../utils/fileManager";
import { IdGenerator } from "../utils/id-generator";
import { Purchase } from '../types/purchase.interface';
import { PurchaseModel } from "../models/Purchase";
import { TransactionServices } from "./transaction.services";

export class PurchaseServices {
    private purchases: PurchaseModel[] = [];
    private path: string = "./data/purchases.json";
    private transactionServices: TransactionServices;

    private generateId(): string {
        return IdGenerator.generatePrefixedId(this.purchases, "P");
    }

    constructor(transactionServices: TransactionServices) {
        this.transactionServices = transactionServices;
        const data = readData(this.path);
        if (!data || data.length === 0) {
            this.purchases = [];
            writeData(this.path, JSON.stringify(this.purchases, null, 2));
            console.log("Purchase file created");
        } else {
            this.purchases = data.map((pur: any) => new PurchaseModel(pur));
            console.log("Purchase file loaded");
        }
    }

    createPurchase(data: Omit<Purchase, 'id'>, createdBy: string) {
        const newPurchase = new PurchaseModel({
            ...data,
            id: this.generateId()
        });

        this.purchases.push(newPurchase);
        writeData(this.path, JSON.stringify(this.purchases, null, 2));

        this.transactionServices.createTransaction(
            "PURCHASE",
            newPurchase.totalCost,
            "BANK_TRANSFER", 
            newPurchase.id,
            createdBy
        );

        console.log("Purchase created successfully");
        return newPurchase;
    }

    deletePurchase(id: string) {
        const index = this.purchases.findIndex(pur => pur.id === id);
        if (index === -1) {
            console.log("Purchase not found");
            return false;
        }

        this.purchases.splice(index, 1);
        writeData(this.path, JSON.stringify(this.purchases, null, 2));
        console.log("Purchase deleted successfully");
        return true;
    }

    getAllPurchases(): PurchaseModel[] {
        return this.purchases;
    }

    getPurchaseById(id: string): PurchaseModel | undefined {
        return this.purchases.find(pur => pur.id === id);
    }

    getPurchasesBySupplier(supplier: string): PurchaseModel[] {
        return this.purchases.filter(pur => pur.supplier === supplier);
    }

    getPurchasesByStaffId(staffId: string): PurchaseModel[] {
        return this.purchases.filter(pur => pur.staffId === staffId);
    }

    updatePurchase(id: string, updates: Partial<Omit<Purchase, 'id' | 'createdAt'>>) {
        const purchase = this.purchases.find(pur => pur.id === id);
        if (!purchase) {
            console.log("Purchase not found");
            return false;
        }

        Object.assign(purchase, updates);
        writeData(this.path, JSON.stringify(this.purchases, null, 2));
        console.log("Purchase updated successfully");
        return true;
    }

    getTotalPurchaseByCost(): number {
        return this.purchases.reduce((sum, pur) => sum + pur.totalCost, 0);
    }

    getTotalPurchaseBySupplier(supplier: string): number {
        return this.getPurchasesBySupplier(supplier)
            .reduce((sum, pur) => sum + pur.totalCost, 0);
    }

    getPurchasesByDateRange(startDate: Date, endDate: Date): PurchaseModel[] {
        return this.purchases.filter(pur => 
            pur.createdAt >= startDate && pur.createdAt <= endDate
        );
    }

    getAveragePurchaseCost(): number {
        if (this.purchases.length === 0) return 0;
        return this.getTotalPurchaseByCost() / this.purchases.length;
    }
}
