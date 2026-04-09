import { Staff } from '../types/staff.interface'

export class StaffModel implements Staff {
  id: string;
  name: string;
  phone: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
  salary: number;

  constructor(data: Staff) {
    this.id = data.id;
    this.name = data.name;
    this.phone = data.phone;
    this.role = data.role;
    this.salary = data.salary;
  }

  
}