import { readData, writeData } from "../utils/fileManager";
import { IdGenerator } from "../utils/id-generator";
import { Product } from '../types/product.interface';
import { ProductModel } from "../models/Product";

export class ProductServices{
    private products: ProductModel[] = [];
    private path: string = "./data/products.json";

    private generateId(): string {
        return IdGenerator.generateSimpleId(this.products);
    }

    constructor(){
        const data = readData(this.path);
        if(!data || data.length === 0){
            this.products = [];
            writeData(this.path, JSON.stringify(this.products, null,2));
            console.log("Product file created");
        } else{
            this.products = data.map((prod: any) => new ProductModel(prod));
            console.log("Product file loaded");
        }
    }

    addProduct(data: Omit<Product, 'id'>) {
        const newProduct = new ProductModel({
            ...data,
            id: this.generateId()
        });

        this.products.push(newProduct);
        writeData(this.path, JSON.stringify(this.products, null, 2));
        console.log("Product added successfully");
    }

    deleteProduct(id: string) {
        const index = this.products.findIndex(prod => prod.id === id);
        if (index === -1) {
            console.log("Product not found");
            return;
        }
    
        this.products.splice(index, 1);
        writeData(this.path, JSON.stringify(this.products, null, 2));
        console.log("Product deleted successfully");
    }

    getAllProducts(): ProductModel[] {
        return this.products;
    }

    getProductById(id: string): ProductModel | undefined {
        return this.products.find(prod => prod.id === id);
    }

    updateStock(id: string, quantity: number) {
        const product = this.products.find(prod => prod.id === id);
        if (product) {
            product.stock += quantity;
            writeData(this.path, JSON.stringify(this.products, null, 2));
        }
    }
}