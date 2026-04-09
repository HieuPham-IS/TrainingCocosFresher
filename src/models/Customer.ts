import { Customer } from '../types/customer.interface'

export class CustomerModel implements Customer {
  id: string;
  name: string;
  phone: string;
  totalSpent: number;
  rank: "NORMAL" | "SILVER" | "GOLD" | "VIP";

  constructor(data: Customer) {
    this.id = data.id;
    this.name = data.name;
    this.phone = data.phone;
    this.totalSpent = data.totalSpent;
    this.rank = data.rank;
  }
  

  static isValidPhone(phone: string){
        const regex = /^(0[35789])[0-9]{8}$/;
        return regex.test(phone);
}


  
}