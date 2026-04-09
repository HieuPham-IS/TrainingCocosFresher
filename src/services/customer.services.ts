import { readData, writeData} from "../utils/fileManager";
import { Customer } from '../types/customer.interface';
import { CustomerModel } from "../models/Customer";

export class CustomerServices{
    private customers: CustomerModel[] = [];
    private path: string = "./data/customers.json";

    private generateId(): string {
        if (this.customers.length === 0){
            return "1";
        }
      
        const max = Math.max(...this.customers.map(cus => parseInt(cus.id))); 
        return (max + 1).toString();
    }

    constructor(){
        const data = readData(this.path);
        if(!data || data.length === 0){
            this.customers = [];
            writeData(this.path, JSON.stringify(this.customers, null,2));
            console.log("Customer file created");
        } else{
            this.customers = data.map((cus: any) => new CustomerModel(cus));
            console.log("Customer file loaded");
        }
    }

    addCustomer(data: Omit<Customer, 'id'>) {
        const existing = this.customers.find(cus => cus.phone === data.phone);
        if (existing) {
            console.log("Customer with this phone already exists");
            return;
        }

        const newCustomer = new CustomerModel({
            ...data,
            id: this.generateId()
        });

        this.customers.push(newCustomer);
        writeData(this.path, JSON.stringify(this.customers, null, 2));
        console.log("Customer added successfully");
    }

    deleteCustomer(id: string) {
        const index = this.customers.findIndex(cus => cus.id === id);
        if (index === -1) {
            console.log("Customer not found");
            return;
        }

        this.customers.splice(index, 1);
        writeData(this.path, JSON.stringify(this.customers, null, 2));
        console.log("Customer deleted successfully");
    }

    getAllCustomers(): CustomerModel[] {
        return this.customers;
    }

    updateTotalSpent(id: string, amount: number) {
        const customer = this.customers.find(cus => cus.id === id);
        if (customer) {
            customer.totalSpent += amount;
            this.updateCustomerRank(id);
        }
    }

    updateCustomerRank(id: string) {
        const customer = this.customers.find(cus => cus.id === id);
        if (!customer) return;

        let newRank: "NORMAL" | "SILVER" | "GOLD" | "VIP" = "NORMAL";
        if (customer.totalSpent >= 10000000) newRank = "VIP";
        else if (customer.totalSpent >= 50000000) newRank = "SILVER";
        else if (customer.totalSpent >= 100000000) newRank = "GOLD";
        
        if (newRank !== customer.rank) {
            customer.rank = newRank;
            writeData(this.path, JSON.stringify(this.customers, null, 2));
            console.log(`Customer rank updated to ${newRank}`);
        }
    }
}


