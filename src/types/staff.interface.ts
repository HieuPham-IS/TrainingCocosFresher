export interface Staff {
  id: string;
  name: string;
  phone: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
  salary: number;
}