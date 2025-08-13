import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import { LayoutCardDirective } from '@components/ht-card/ht-card.directive';
import { Balance } from '@models/balance.model';
import { UserModel } from '@models/user.model';
import { TransactionsService } from '@services/transactions.service';
import { UserService } from '@services/user.service';
import { forkJoin } from 'rxjs';
import { AbsPipe } from 'src/app/pipes/absolute.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [
    HtCardComponent,
    LayoutCardDirective,
    CurrencyPipe,
    NgClass,
    AbsPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private transactionsService: TransactionsService =
    inject(TransactionsService);
  private userService: UserService = inject(UserService);
  balance: Balance = {} as Balance;
  previousBalance: Balance = {} as Balance;
  beforePrevBalance: Balance = {} as Balance;
  percentageBalance: number = 0;
  percentagePeriodChange: number = 0;
  user!: UserModel;

  ngOnInit(): void {
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
      if (!response[0]?.value && !response[1]?.value) return;
      this.balance = response[0];
      this.previousBalance = response[1];
      this.beforePrevBalance = response[2];
      this.percentageBalance =
        this.previousBalance.value === 0
          ? this.balance.value === 0
            ? 0
            : 100
          : ((this.balance.value - this.previousBalance.value) /
              Math.abs(this.previousBalance.value || 0)) *
            100;
      const periodChange = this.balance.value - this.previousBalance.value;
      const previousPeriodChange =
        this.previousBalance.value - this.beforePrevBalance.value;
      this.percentagePeriodChange = this.percent2Months(previousPeriodChange, periodChange);
        ((periodChange - previousPeriodChange) /
          Math.abs(previousPeriodChange || 0)) *
        100;
    });
  }

  change2Months(numberOne: number, numberTwo: number): number {
    return numberOne - numberTwo;
  }

  percent2Months(numberOne: number, numberTwo: number): number {
    return numberOne === 0
      ? numberTwo === 0
        ? 0
        : 100
      : ((numberTwo - numberOne) / Math.abs(numberOne || 0)) * 100;
  }
}
