import { readData, writeData } from "../utils/fileManager";
import { Invoice } from '../types/invoice.interface';
import { InvoiceModel } from "../models/Invoice";

export class InvoiceServices{
    private invoices: InvoiceModel[] = [];
    private path: string = "./data/invoices.json";

    private generateId(): string {
        if (this.invoices.length === 0){
            return "1";
    }
      
        const max = Math.max(...this.invoices.map(inv => parseInt(inv.id)));
        return (max + 1).toString();
    }

    constructor(){
        const data = readData(this.path);
        if(!data || data.length === 0){
            this.invoices = [];
            writeData(this.path, JSON.stringify(this.invoices, null,2));
            console.log("Invoice file created");
        } else{
            this.invoices = data.map((inv: any) => new InvoiceModel(inv));
            console.log("Invoice file loaded");
        }
    }

    createInvoice(data: Omit<Invoice, 'id'>) {
        const newInvoice = new InvoiceModel({
            ...data,
            id: this.generateId()
        });

        this.invoices.push(newInvoice);
        writeData(this.path, JSON.stringify(this.invoices, null, 2));
        console.log("Invoice created successfully");
        return newInvoice;
    }

    getInvoiceById(id: string): InvoiceModel | undefined {
        return this.invoices.find(inv => inv.id === id);
    }

    getAllInvoices(): InvoiceModel[] {
        return this.invoices;
    }

    processReturn(invoiceId: string, returnedItems: { productId: string, quantity: number }[]) {
        const invoice = this.invoices.find(inv => inv.id === invoiceId);
        if (!invoice) {
            console.log("Invoice not found");
            return;
        }
        console.log("Return processed for invoice", invoiceId);
       
    }
}