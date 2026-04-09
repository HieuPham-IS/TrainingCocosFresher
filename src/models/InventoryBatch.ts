import { InventoryBatch } from '../types/interface'

export class InventoryBatchModel implements InventoryBatch {
  id: string;
  productId: string;
  quantity: number;
  costPrice: number;
  importedAt: Date;
  createdBy: string;

  constructor(data: InventoryBatch) {
    this.id = data.id;
    this.productId = data.productId;
    this.quantity = data.quantity;
    this.costPrice = data.costPrice;
    this.importedAt = data.importedAt;
    this.createdBy = data.createdBy;
  }

}