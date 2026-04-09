export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalSpent: number;
  rank: "NORMAL" | "SILVER" | "GOLD" | "VIP";
}