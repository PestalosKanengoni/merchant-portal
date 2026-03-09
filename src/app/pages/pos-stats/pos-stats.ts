import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Location } from '@angular/common';
import { Auth } from '../../services/auth';
import { StorageService } from '../../services/storage';

// Register Chart.js components
Chart.register(...registerables);

interface Terminal {
  id: string;
  name: string;
  transactions: number;
  revenue: number;
  status: 'active' | 'idle';
}

interface StatCard {
  icon: string;
  iconClass: string;
  value: string;
  label: string;
  change: string;
  changeType: 'positive' | 'negative';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos-stats.html',
  styleUrls: ['./pos-stats.css']
})
export class PosStats implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('transactionsChart') transactionsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('paymentMethodChart') paymentMethodChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hourlyChart') hourlyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('productsChart') productsChartRef!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];
  userEmail: string = '';

  constructor(private location: Location,
    private auth: Auth,
    private storageService: StorageService
  ){}

  // User data
  userName = 'John';
  userRole = ' Manager';
  userLocation = 'Main Branch';
  userInitials = 'M';

  // Date range
  selectedDateRange = 'week';
  dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  // Stats data
  stats: StatCard[] = [
    {
      icon: '💰',
      iconClass: 'revenue',
      value: '$45,280',
      label: 'Total Revenue',
      change: '↑ 12.5% from last week',
      changeType: 'positive'
    },
    {
      icon: '📊',
      iconClass: 'transactions',
      value: '2,847',
      label: 'Total Transactions',
      change: '↑ 8.3% from last week',
      changeType: 'positive'
    },
    {
      icon: '🖥️',
      iconClass: 'terminals',
      value: '12',
      label: 'Active Terminals',
      change: '↑ 2 new terminals',
      changeType: 'positive'
    },
    {
      icon: '📈',
      iconClass: 'average',
      value: '$15.91',
      label: 'Avg Transaction Value',
      change: '↑ 3.7% from last week',
      changeType: 'positive'
    }
  ];

  // Terminal data
  terminals: Terminal[] = [
    { id: 'T001', name: 'Terminal 1 - Checkout A', transactions: 428, revenue: 6820, status: 'active' },
    { id: 'T002', name: 'Terminal 2 - Checkout B', transactions: 392, revenue: 6240, status: 'active' },
    { id: 'T003', name: 'Terminal 3 - Express Lane', transactions: 516, revenue: 4980, status: 'active' },
    { id: 'T004', name: 'Terminal 4 - Customer Service', transactions: 283, revenue: 5430, status: 'active' },
    { id: 'T005', name: 'Terminal 5 - Self Checkout 1', transactions: 341, revenue: 3890, status: 'active' },
    { id: 'T006', name: 'Terminal 6 - Self Checkout 2', transactions: 298, revenue: 3420, status: 'idle' },
    { id: 'T007', name: 'Terminal 7 - Mobile POS', transactions: 189, revenue: 4150, status: 'active' },
    { id: 'T008', name: 'Terminal 8 - Drive Through', transactions: 400, revenue: 6350, status: 'active' }
  ];

  ngOnInit(): void {
    this.userEmail = this.storageService.getUserEmail() || 'Unknown User';
    // Component initialization
    console.log('Dashboard initialized');
  }

  ngAfterViewInit(): void {
    // Initialize charts after view is ready
    setTimeout(() => {
      this.initializeCharts();
    }, 0);
  }

  ngOnDestroy(): void {
    // Clean up charts
    this.charts.forEach(chart => chart.destroy());
  }

  onDateRangeChange(): void {
    console.log('Date range changed to:', this.selectedDateRange);
    // Here you would typically fetch new data from your service
    // this.loadDashboardData(this.selectedDateRange);
  }

  getTerminalInitials(id: string): string {
    return id.slice(-2);
  }

  formatCurrency(value: number): string {
    return `$${value.toLocaleString()}`;
  }

  private initializeCharts(): void {
    this.initTransactionsChart();
    this.initPaymentMethodChart();
    this.initHourlyChart();
    this.initProductsChart();
  }

  private initTransactionsChart(): void {
    const ctx = this.transactionsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Transactions',
          data: [385, 420, 398, 445, 512, 628, 459],
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#f1f5f9'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private initPaymentMethodChart(): void {
    const ctx = this.paymentMethodChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['Credit Card', 'Debit Card', 'Cash', 'Mobile Pay', 'Gift Card'],
        datasets: [{
          data: [42, 28, 15, 12, 3],
          backgroundColor: [
            '#667eea',
            '#764ba2',
            '#f59e0b',
            '#10b981',
            '#ec4899'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private initHourlyChart(): void {
    const ctx = this.hourlyChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM'],
        datasets: [{
          label: 'Transactions',
          data: [45, 78, 92, 125, 168, 142, 98, 115, 135, 158, 142, 95],
          backgroundColor: '#667eea'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#f1f5f9'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private initProductsChart(): void {
    const ctx = this.productsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Coffee', 'Sandwiches', 'Snacks', 'Beverages', 'Pastries'],
        datasets: [{
          label: 'Sales',
          data: [8500, 6200, 5800, 4900, 3600],
          backgroundColor: '#764ba2',
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: '#f1f5f9'
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  onLogout() {
    // Optional: Add a confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
    localStorage.clear();
      this.auth.logout();
    }
  }

  goBack(): void {
    // Option 1: Go back to previous page in browser history
    this.location.back();

    // Option 2: Navigate to specific route (e.g., dashboard)
    // this.router.navigate(['/dashboard']);
  }
}
