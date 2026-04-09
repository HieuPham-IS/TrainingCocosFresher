# Clothing Store Accounting & Management System

## Overview

This project is a Clothing Store Management System integrated with basic accounting feature

The system helps manage:

- Sales (Invoices)
- Inventory (Stock & Cost)
- Expenses
- Supplier payments
- Staff activities
- Financial reports

---

# Objectives

- Manage product inventory efficiently
- Track revenue and expenses
- Calculate profit/loss
- Support staff operations
- Provide financial insights via reports

---

# Objects

## 1. Product

```ts
id: string;
name: string;
category: string;
size: "S" | "M" | "L" | "XL";
color: string;
material: string;
price: number;
costPrice: number;
stock: number;
minThreshold: number;
```

## 2. Customer

```ts
id: string;
name: string;
phone: string;
totalSpent: number;
rank: "NORMAL" | "SILVER" | "GOLD" | "VIP";
```

## 3. Staff

```ts
id: string;
name: string;
phone: string;
role: "ADMIN" | "MANAGER" | "STAFF";
salary: number;
```

## 4. Account

```ts
id: string;
staffId: string;
username: string;
password: string;
role: "ADMIN" | "MANAGER" | "STAFF";
```

## 5. Invoice

```ts
id: string
customerId?: string
staffId: string
items: InvoiceItem[]
totalAmount: number
discount: number
finalAmount: number
paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'E_WALLET'
createdAt: Date
```

## 6. InvoiceItem

```ts
productId: string;
quantity: number;
price: number;
cost: number;
```

## 7. Purchase

```ts
id: string
supplier: string
staffId: string
items: PurchaseItem[]
totalCost: number
createdAt: Date
```

## 8. PurchaseItem

```ts
productId: string;
quantity: number;
costPrice: number;
```

## 9. InventoryBatch

```ts
id: string;
productId: string;
quantity: number;
costPrice: number;
importedAt: Date;
createdBy: string;
```

## 10. Transaction

```ts
id: string;
type: "INCOME";
category: "SALES" | "PURCHASE" | "SALARY" | "RENT" | "MARKETING" | "REFUND";
amount: number;
paymentMethod: "CASH" | "BANK_TRANSFER" | "CARD" | "E_WALLET";
referenceId: string;
createdBy: string;
createdAt: Date;
```

## 11. Expenses

```ts
id: string;
type: "FIXED" | "VARIABLE";
amount: number;
description: string;
paymentMethod: "CASH" | "BANK_TRANSFER" | "CARD" | "E_WALLET";
createdBy: string;
date: Date;
```

## 12. Refund

```ts
id: string
invoiceId: string
items: ReturnItem[]
refundAmount: number
createdBy: string
createdAt: Date
```

## 13. ReturnItem

```ts
productId: string;
quantity: number;
```

## 14. PeriodReport

```ts
revenue: number;
cogs: number;
expenses: number;
grossProfit: number;
netProfit: number;
momGrowth: number;
yoyGrowth: number;
totalOrders: number;
aov: number;
```

# Features

## 1. Sales Management

- Create invoice
- Calculate total & discount
- Immediate payment
- Auto-generate transaction
- Deduct stock

## 2. Inventory Management

- Track stock quantity
- Import goods
- Inventory batches for cost calculation
- Low stock alert

## 3. Accounting

- Record income & expenses
- Track supplier debt
- Cashflow tracking

## 4. Refund

- Partial or full return
- Restore stock
- Record refund transaction

## 5. Staff Management

- Manage employees
- Role-based access:
  ADMIN | MANAGER | STAFF

## 6. Reporting

- Profit & Loss (P&L)
- Revenue tracking
- Expense tracking
- Sales performance
