import { PeriodReport } from '../types/interface'

export class PeriodReportModel implements PeriodReport {
  revenue: number;
  cogs: number;
  expenses: number;
  grossProfit: number;
  netProfit: number;
  momGrowth: number;
  yoyGrowth: number;
  totalOrders: number;
  aov: number;

  constructor(data: PeriodReport) {
    this.revenue = data.revenue;
    this.cogs = data.cogs;
    this.expenses = data.expenses;
    this.grossProfit = data.grossProfit;
    this.netProfit = data.netProfit;
    this.momGrowth = data.momGrowth;
    this.yoyGrowth = data.yoyGrowth;
    this.totalOrders = data.totalOrders;
    this.aov = data.aov;
  }

}