import { AccountModel } from "../models/Account";
import { readData, writeData } from "../utils/fileManager";
import { IdGenerator } from "../utils/id-generator";
import { Account } from '../types/account.interface';

export class AccountServices{
    private accounts: AccountModel[] = [];
    private path: string = "./data/accounts.json";

    private generateId(): string {
        return IdGenerator.generateSimpleId(this.accounts);
    }

    private generateStaffId(): string {
        return IdGenerator.generateStaffId(this.accounts);
    }

    constructor(){
        const data = readData(this.path);
        if(!data || data.length === 0){
            this.accounts = [];
            const defaultAdmin = new AccountModel({
                id: "1",
                staffId: "S001",
                username: "admin",
                password: "Admin@123",
                role: "ADMIN"
            });
            this.accounts.push(defaultAdmin);
            writeData(this.path, JSON.stringify(this.accounts, null,2));
            console.log("Account file created with default admin account");
        } else{
            this.accounts = data.map((acc: any) => new AccountModel(acc));
            console.log("Account file loaded");
        }
    }

    registerAccount(currentUser: AccountModel, data: Account) {
        if (currentUser.role === "STAFF") {
            console.log("No permission to create an account.");
            return;
        }

        if (currentUser.role === "MANAGER" && data.role !== "STAFF") {
            console.log("Managers are only allowed to create STAFF accounts.");
            return;
        }

        const existing = this.accounts.find(acc => acc.username === data.username);
        if (existing) {
            console.log("Account already exists");
            return;
        }

        const temp = new AccountModel(data);
        if (!temp.isValidPassword(data.password)) {
            console.log("Invalid password");
            return;
        }

        const newAccount = new AccountModel({
          ...data,
          id: this.generateId(),
          staffId: this.generateStaffId()
        });
      
        this.accounts.push(newAccount);
        writeData(this.path, JSON.stringify(this.accounts, null, 2));
        console.log("Account registered successfully");
    }

    loginAccount(username: string, password: string): AccountModel | null{
        const acc = this.accounts.find(a => a.username === username);

        if(!acc){
            console.log("User not found");
            return null;
        }

        if(acc.password !== password){
            console.log("Wrong password");
            return null;
        } 

        console.log("Login success");
        return acc;
    }
    
}

