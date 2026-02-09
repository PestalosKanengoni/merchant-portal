import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PosStats } from '../pages/pos-stats/pos-stats';

export interface Terminal {
  id: string;
  name: string;
  transactions: number;
  revenue: number;
  status: 'active' | 'idle';
}

export interface PosStatsService {
  totalRevenue: number;
  totalTransactions: number;
  activeTerminals: number;
  avgTransactionValue: number;
  revenueChange: number;
  transactionsChange: number;
  terminalsChange: number;
  avgValueChange: number;
}

export interface ChartData {
  dailyTransactions: number[];
  paymentMethods: { label: string; value: number }[];
  hourlyVolume: number[];
  topProducts: { label: string; value: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class PosStatsService {
  constructor() { }


  getTerminals(): Observable<Terminal[]> {
    const terminals: Terminal[] = [
      { id: 'T001', name: 'Terminal 1 - Checkout A', transactions: 428, revenue: 6820, status: 'active' },
      { id: 'T002', name: 'Terminal 2 - Checkout B', transactions: 392, revenue: 6240, status: 'active' },
      { id: 'T003', name: 'Terminal 3 - Express Lane', transactions: 516, revenue: 4980, status: 'active' },
      { id: 'T004', name: 'Terminal 4 - Customer Service', transactions: 283, revenue: 5430, status: 'active' },
      { id: 'T005', name: 'Terminal 5 - Self Checkout 1', transactions: 341, revenue: 3890, status: 'active' },
      { id: 'T006', name: 'Terminal 6 - Self Checkout 2', transactions: 298, revenue: 3420, status: 'idle' },
      { id: 'T007', name: 'Terminal 7 - Mobile POS', transactions: 189, revenue: 4150, status: 'active' },
      { id: 'T008', name: 'Terminal 8 - Drive Through', transactions: 400, revenue: 6350, status: 'active' }
    ];

    return of(terminals).pipe(delay(300));
  }

  /**
   * Fetch chart data
   */
  getChartData(dateRange: string): Observable<ChartData> {
    const chartData: ChartData = {
      dailyTransactions: [385, 420, 398, 445, 512, 628, 459],
      paymentMethods: [
        { label: 'Credit Card', value: 42 },
        { label: 'Debit Card', value: 28 },
        { label: 'Cash', value: 15 },
        { label: 'Mobile Pay', value: 12 },
        { label: 'Gift Card', value: 3 }
      ],
      hourlyVolume: [45, 78, 92, 125, 168, 142, 98, 115, 135, 158, 142, 95],
      topProducts: [
        { label: 'Coffee', value: 8500 },
        { label: 'Sandwiches', value: 6200 },
        { label: 'Snacks', value: 5800 },
        { label: 'Beverages', value: 4900 },
        { label: 'Pastries', value: 3600 }
      ]
    };

    return of(chartData).pipe(delay(300));
  }

  /**
   * Format currency values
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Format percentage change
   */
  formatPercentage(value: number): string {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  }
}
