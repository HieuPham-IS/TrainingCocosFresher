import { Product } from '../types/product.interface'

export class ProductModel implements Product {
  id: string;
  name: string;
  category: string;
  size: "S" | "M" | "L" | "XL";
  color: string;
  material: string;
  price: number;
  costPrice: number;
  stock: number;
  minThreshold: number;

  constructor(data: Product) {
    this.id = data.id;
    this.name = data.name;
    this.category = data.category;
    this.size = data.size;
    this.color = data.color;
    this.material = data.material;
    this.price = data.price;
    this.costPrice = data.costPrice;
    this.stock = data.stock;
    this.minThreshold = data.minThreshold;
  }

}