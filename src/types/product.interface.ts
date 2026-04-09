export interface Product {
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
}