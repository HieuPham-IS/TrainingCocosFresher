import { Account } from '../types/account.interface'

export class AccountModel implements Account {
  id: string;
  staffId: string;
  username: string;
  password: string;
  role: "ADMIN" | "MANAGER" | "STAFF";

  constructor(data: Account) {
    this.id = data.id;
    this.staffId = data.staffId;
    this.username = data.username;
    this.password = data.password;
    this.role = data.role;
  }

  isValidPassword(pass: string){
    const regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pass);
  }
  

}