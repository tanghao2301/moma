import { Component, inject, OnInit } from '@angular/core';
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import { Balance } from '@models/balance.model';
import { UserModel } from '@models/user.model';
import { Transaction } from '@models/transaction.model';
import { TransactionsService } from '@services/transactions.service';
import { UserService } from '@services/user.service';
import { DashboardLayoutComponent } from "@shared/layouts/dashboard-layout/dashboard-layout.component";
import { delay, forkJoin, combineLatest } from 'rxjs';
import { BalanceChartComponent } from './balance-chart/balance-chart.component';
import { HtButtonComponent } from '@components/ht-button/ht-button.component';
import { CurrencyPipe, DatePipe, PercentPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    HtCardComponent,
    BalanceChartComponent,
    DashboardLayoutComponent,
    CurrencyPipe,
    DatePipe,
    PercentPipe,
    NgClass,
    HtButtonComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private transactionsService: TransactionsService =
    inject(TransactionsService);
  private userService: UserService = inject(UserService);
  readonly defaultBalance: Balance = {
    value: 0,
    totalExpenses: 0,
    month: 0,
    totalIncome: 0,
    year: 0,
  };
  isLoading: boolean = false;
  balance: Balance = {} as Balance;
  previousBalance: Balance = {} as Balance;
  beforePrevBalance: Balance = {} as Balance;
  percentageBalance: number = 0;
  percentagePeriodChange: number = 0;
  percentageTotalExpenses: number = 0;
  percentageTotalIncome: number = 0;
  periodChange: number = 0;
  previousPeriodChange: number = 0;
  user!: UserModel;
  recentTransactions: Transaction[] = [];

  ngOnInit(): void {
    this.isLoading = true;
    const userId = this.userService.getUserId();

    // Fetch user profile name
    this.userService.getUserById(userId).subscribe(user => this.user = user);

    // Fetch dynamic transactions for recent activities list
    this.transactionsService.getTransactionsById(userId, 'Income').subscribe();
    this.transactionsService.getTransactionsById(userId, 'Expense').subscribe();

    combineLatest([
      this.transactionsService.getIncomes(),
      this.transactionsService.getExpenses()
    ]).subscribe(([incomes, expenses]) => {
      const all = [...(incomes || []), ...(expenses || [])];
      all.sort((a, b) => {
        const dateA = a.createdAt ? new Date((a.createdAt as any).seconds ? (a.createdAt as any).seconds * 1000 : a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date((b.createdAt as any).seconds ? (b.createdAt as any).seconds * 1000 : b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      this.recentTransactions = all.slice(0, 5);
    });

    forkJoin([
      this.transactionsService.getMonthlyBalanceByOffset(userId, 0),
      this.transactionsService.getMonthlyBalanceByOffset(userId, -1),
      this.transactionsService.getMonthlyBalanceByOffset(userId, -2),
    ]).pipe(delay(300)).subscribe((response) => {
      this.isLoading = false;
      if (!response[0]?.value && !response[1]?.value) return;
      this.balance = {
        ...this.defaultBalance,
        ...response[0],
      };
      this.previousBalance = {
        ...this.defaultBalance,
        ...response[1],
      };
      this.beforePrevBalance = {
        ...this.defaultBalance,
        ...response[2],
      };
      this.percentageBalance = this.transactionsService.percent2Months(
        this.balance.value,
        this.previousBalance.value
      );
      this.periodChange = this.balance.value - this.previousBalance.value;
      this.previousPeriodChange =
        this.previousBalance.value - this.beforePrevBalance.value;
      this.percentagePeriodChange = this.transactionsService.percent2Months(
        this.periodChange,
        this.previousPeriodChange
      );
      this.percentageTotalExpenses = this.transactionsService.percent2Months(
        this.balance.totalExpenses,
        this.previousBalance.totalExpenses
      );
      this.percentageTotalIncome = this.transactionsService.percent2Months(
        this.balance.totalIncome,
        this.previousBalance.totalIncome
      );
    });
  }
}
