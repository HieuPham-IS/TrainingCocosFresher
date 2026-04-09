export interface Account {
  id: string;
  staffId: string;
  username: string;
  password: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
}