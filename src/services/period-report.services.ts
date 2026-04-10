import { PeriodReportModel } from "../models/PeriodReport";
import { PeriodReport } from "../types/interface";
import { InvoiceServices } from "./invoice.services";
import { ExpenseServices } from "./expense.services";
import { InventoryBatchServices } from "./inventory-batch.services";
import { RefundServices } from "./refund.services";
import { PurchaseServices } from "./purchase.services";

export class PeriodReportServices {
    private invoiceServices: InvoiceServices;
    private expenseServices: ExpenseServices;
    private inventoryBatchServices: InventoryBatchServices;
    private refundServices: RefundServices;
    private purchaseServices: PurchaseServices;

    constructor(
        invoiceServices: InvoiceServices,
        expenseServices: ExpenseServices,
        inventoryBatchServices: InventoryBatchServices,
        refundServices: RefundServices,
        purchaseServices: PurchaseServices
    ) {
        this.invoiceServices = invoiceServices;
        this.expenseServices = expenseServices;
        this.inventoryBatchServices = inventoryBatchServices;
        this.refundServices = refundServices;
        this.purchaseServices = purchaseServices;
    }

    generatePeriodReport(startDate: Date, endDate: Date): PeriodReportModel {
        const invoices = this.invoiceServices.getAllInvoices();
        const revenue = invoices
            .filter(inv => new Date(inv.createdAt) >= startDate && new Date(inv.createdAt) <= endDate)
            .reduce((sum, inv) => sum + inv.totalAmount, 0);

        const purchases = this.purchaseServices.getPurchasesByDateRange(startDate, endDate);
        const cogs = purchases.reduce((sum, pur) => sum + pur.totalCost, 0);

        const expenses = this.expenseServices.getTotalExpensesByDate(startDate, endDate);

        const refunds = this.refundServices.getRefundsByDateRange(startDate, endDate)
            .reduce((sum, ref) => sum + ref.refundAmount, 0);

        const adjustedRevenue = revenue - refunds;

        const grossProfit = adjustedRevenue - cogs;

        const netProfit = grossProfit - expenses;

        const totalOrders = invoices.filter(inv => 
            new Date(inv.createdAt) >= startDate && new Date(inv.createdAt) <= endDate
        ).length;

        const aov = totalOrders > 0 ? adjustedRevenue / totalOrders : 0;

        const previousMonthStart = new Date(startDate);
        previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
        const previousMonthEnd = new Date(startDate);
        previousMonthEnd.setDate(0);

        const previousMonthRevenue = invoices
            .filter(inv => {
                const invDate = new Date(inv.createdAt);
                return invDate >= previousMonthStart && invDate <= previousMonthEnd;
            })
            .reduce((sum, inv) => sum + inv.totalAmount, 0);

        const momGrowth = previousMonthRevenue > 0 
            ? ((adjustedRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
            : 0;

        const previousYearStart = new Date(startDate);
        previousYearStart.setFullYear(previousYearStart.getFullYear() - 1);
        const previousYearEnd = new Date(endDate);
        previousYearEnd.setFullYear(previousYearEnd.getFullYear() - 1);

        const previousYearRevenue = invoices
            .filter(inv => {
                const invDate = new Date(inv.createdAt);
                return invDate >= previousYearStart && invDate <= previousYearEnd;
            })
            .reduce((sum, inv) => sum + inv.totalAmount, 0);

        const yoyGrowth = previousYearRevenue > 0 
            ? ((adjustedRevenue - previousYearRevenue) / previousYearRevenue) * 100 
            : 0;

        const report = new PeriodReportModel({
            revenue: adjustedRevenue,
            cogs,
            expenses,
            grossProfit,
            netProfit,
            momGrowth,
            yoyGrowth,
            totalOrders,
            aov
        });

        return report;
    }

    generateMonthlyReport(year: number, month: number): PeriodReportModel {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        return this.generatePeriodReport(startDate, endDate);
    }

    generateYearlyReport(year: number): PeriodReportModel {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        return this.generatePeriodReport(startDate, endDate);
    }

    generateQuarterlyReport(year: number, quarter: number): PeriodReportModel {
        const month = (quarter - 1) * 3 + 1;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month + 2, 0);
        return this.generatePeriodReport(startDate, endDate);
    }
}
