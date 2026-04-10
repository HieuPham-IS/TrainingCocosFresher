import { readData, writeData } from "../utils/fileManager";
import { IdGenerator } from "../utils/id-generator";
import { InventoryBatch } from '../types/interface';
import { InventoryBatchModel } from "../models/InventoryBatch";

export class InventoryBatchServices {
    private batches: InventoryBatchModel[] = [];
    private path: string = "./data/inventory-batch.json";

    private generateId(): string {
        return IdGenerator.generatePrefixedId(this.batches, "B");
    }

    constructor() {
        const data = readData(this.path);
        if (!data || data.length === 0) {
            this.batches = [];
            writeData(this.path, JSON.stringify(this.batches, null, 2));
            console.log("Inventory Batch file created");
        } else {
            this.batches = data.map((batch: any) => new InventoryBatchModel(batch));
            console.log("Inventory Batch file loaded");
        }
    }

    createBatch(data: Omit<InventoryBatch, 'id'>) {
        const newBatch = new InventoryBatchModel({
            ...data,
            id: this.generateId()
        });

        this.batches.push(newBatch);
        writeData(this.path, JSON.stringify(this.batches, null, 2));
        console.log("Inventory batch created successfully");
        return newBatch;
    }

    deleteBatch(id: string) {
        const index = this.batches.findIndex(batch => batch.id === id);
        if (index === -1) {
            console.log("Inventory batch not found");
            return false;
        }

        this.batches.splice(index, 1);
        writeData(this.path, JSON.stringify(this.batches, null, 2));
        console.log("Inventory batch deleted successfully");
        return true;
    }

    getAllBatches(): InventoryBatchModel[] {
        return this.batches;
    }

    getBatchById(id: string): InventoryBatchModel | undefined {
        return this.batches.find(batch => batch.id === id);
    }

    getBatchesByProductId(productId: string): InventoryBatchModel[] {
        return this.batches.filter(batch => batch.productId === productId);
    }

    updateBatchQuantity(id: string, newQuantity: number) {
        const batch = this.batches.find(batch => batch.id === id);
        if (!batch) {
            console.log("Inventory batch not found");
            return false;
        }

        batch.quantity = newQuantity;
        writeData(this.path, JSON.stringify(this.batches, null, 2));
        console.log("Inventory batch quantity updated successfully");
        return true;
    }

    updateBatch(id: string, updates: Partial<Omit<InventoryBatch, 'id'>>) {
        const batch = this.batches.find(b => b.id === id);
        if (!batch) {
            console.log("Inventory batch not found");
            return false;
        }

        Object.assign(batch, updates);
        writeData(this.path, JSON.stringify(this.batches, null, 2));
        console.log("Inventory batch updated successfully");
        return true;
    }

    getTotalQuantityByProductId(productId: string): number {
        return this.getBatchesByProductId(productId)
            .reduce((sum, batch) => sum + batch.quantity, 0);
    }

    getTotalInventoryValue(): number {
        return this.batches.reduce((sum, batch) => sum + (batch.quantity * batch.costPrice), 0);
    }

    getProductInventoryValue(productId: string): number {
        return this.getBatchesByProductId(productId)
            .reduce((sum, batch) => sum + (batch.quantity * batch.costPrice), 0);
    }

    getLowStockBatches(threshold: number = 10): InventoryBatchModel[] {
        return this.batches.filter(batch => batch.quantity <= threshold);
    }
}
