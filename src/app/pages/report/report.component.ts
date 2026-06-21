import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TransactionsService } from '@services/transactions.service';
import { UserService } from '@services/user.service';
import { forkJoin } from 'rxjs';
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import { LayoutCardDirective } from '@components/ht-card/ht-card.directive';
import { DashboardLayoutComponent } from '@shared/layouts/dashboard-layout/dashboard-layout.component';
import { Transaction } from '@models/transaction.model';
import { Balance } from '@models/balance.model';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    HtCardComponent,
    LayoutCardDirective,
    DashboardLayoutComponent,
    CurrencyPipe
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
  private transactionsService = inject(TransactionsService);
  private userService = inject(UserService);

  incomeExpenseData: any;
  incomeExpenseOptions: any;
  
  categoryData: any;
  categoryOptions: any;

  monthlyTrendData: any;
  monthlyTrendOptions: any;

  userId = this.userService.getUserId();

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const userId = this.userService.getUserId();
    
    forkJoin({
      balances: this.transactionsService.getMonthlyBalancesThisYear(userId),
      expenses: this.transactionsService.getTransactionsById(userId, 'Expense')
    }).subscribe(({ balances, expenses }) => {
      this.initIncomeExpenseChart(balances);
      this.initCategoryChart(expenses);
      this.initMonthlyTrendChart(balances);
    });
  }

  initIncomeExpenseChart(balances: Balance[]) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const incomeData = new Array(12).fill(0);
    const expenseData = new Array(12).fill(0);

    balances.forEach(b => {
      if (b.month >= 1 && b.month <= 12) {
        incomeData[b.month - 1] = b.totalIncome;
        expenseData[b.month - 1] = b.totalExpenses;
      }
    });

    const documentStyle = getComputedStyle(document.documentElement);

    this.incomeExpenseData = {
      labels: months,
      datasets: [
        {
          label: 'Income',
          backgroundColor: documentStyle.getPropertyValue('--color-primary') || '#22C55E',
          data: incomeData
        },
        {
          label: 'Expenses',
          backgroundColor: '#EF4444',
          data: expenseData
        }
      ]
    };

    this.incomeExpenseOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: '#4B5563'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#6B7280',
            font: {
              weight: 500
            }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: '#6B7280'
          },
          grid: {
            color: '#F3F4F6',
            drawBorder: false
          }
        }
      }
    };
  }

  initCategoryChart(expenses: Transaction[]) {
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(e => {
      const catName = e.type?.name || 'Uncategorized';
      categoryTotals[catName] = (categoryTotals[catName] || 0) + (e.convertedAmount || 0);
    });

    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1]);

    const labels = sortedCategories.map(c => c[0]);
    const data = sortedCategories.map(c => c[1]);

    this.categoryData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
            '#EC4899', '#06B6D4', '#6366F1', '#F97316', '#14B8A6'
          ],
          hoverBackgroundColor: [
            '#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', 
            '#DB2777', '#0891B2', '#4F46E5', '#EA580C', '#0D9488'
          ]
        }
      ]
    };

    this.categoryOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    color: '#4B5563'
                }
            }
        }
    };
  }

  initMonthlyTrendChart(balances: Balance[]) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendData = new Array(12).fill(0);

    // Sort balances by month
    balances.sort((a, b) => a.month - b.month);
    
    balances.forEach(b => {
      if (b.month >= 1 && b.month <= 12) {
        trendData[b.month - 1] = b.value;
      }
    });

    this.monthlyTrendData = {
      labels: months,
      datasets: [
        {
          label: 'Net Balance',
          data: trendData,
          fill: true,
          borderColor: '#6366F1',
          tension: 0.4,
          backgroundColor: 'rgba(99, 102, 241, 0.2)'
        }
      ]
    };

    this.monthlyTrendOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
            display: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#6B7280'
          },
          grid: {
            display: false
          }
        },
        y: {
          ticks: {
            color: '#6B7280'
          },
          grid: {
            color: '#F3F4F6'
          }
        }
      }
    };
  }
}
