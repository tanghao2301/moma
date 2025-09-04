import { CurrencyPipe, DecimalPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import { LayoutCardDirective } from '@components/ht-card/ht-card.directive';
import { Balance } from '@models/balance.model';
import { UserModel } from '@models/user.model';
import { TransactionsService } from '@services/transactions.service';
import { UserService } from '@services/user.service';
import { DashboardLayoutComponent } from "@shared/layouts/dashboard-layout/dashboard-layout.component";
import { SkeletonModule } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { AbsPipe } from 'src/app/pipes/absolute.pipe';
import { BalanceChartComponent } from './balance-chart/balance-chart.component';


@Component({
  selector: 'app-dashboard',
  imports: [
    HtCardComponent,
    LayoutCardDirective,
    CurrencyPipe,
    NgClass,
    AbsPipe,
    DecimalPipe,
    NgTemplateOutlet,
    SkeletonModule,
    Tooltip,
    BalanceChartComponent,
    DashboardLayoutComponent
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
  user!: UserModel;

  ngOnInit(): void {
    this.isLoading = true;
    forkJoin([
      this.transactionsService.getMonthlyBalanceByOffset(
        this.userService.getUserId(),
        0
      ),
      this.transactionsService.getMonthlyBalanceByOffset(
        this.userService.getUserId(),
        -1
      ),
      this.transactionsService.getMonthlyBalanceByOffset(
        this.userService.getUserId(),
        -2
      ),
    ]).subscribe((response) => {
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
      this.percentageBalance = this.percent2Months(
        this.balance.value,
        this.previousBalance.value
      );
      const periodChange = this.balance.value - this.previousBalance.value;
      const previousPeriodChange =
        this.previousBalance.value - this.beforePrevBalance.value;
      this.percentagePeriodChange = this.percent2Months(
        periodChange,
        previousPeriodChange
      );
      this.percentageTotalExpenses = this.percent2Months(
        this.balance.totalExpenses,
        this.previousBalance.totalExpenses
      );
      this.percentageTotalIncome = this.percent2Months(
        this.balance.totalIncome,
        this.previousBalance.totalIncome
      );
    });
  }

  change2Months(current: number, previous: number): number {
    return current - previous;
  }

  percent2Months(current: number, previous: number): number {
    return previous === 0
      ? current === 0
        ? 0
        : 100
      : ((current - previous) / Math.abs(previous || 0)) * 100;
  }
}
