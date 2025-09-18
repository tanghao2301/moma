import { AsyncPipe, CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HtButtonComponent } from '@components/ht-button/ht-button.component';
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import {
  CURRENCY_OPTIONS,
  FREQUENCY_OPTIONS,
  TYPE_EXPENSE_OPTIONS,
} from '@enum/transaction.enum';
import { Balance } from '@models/balance.model';
import { Frequency, Transaction, Type } from '@models/transaction.model';
import { LoadingService } from '@services/loading.service';
import { ToastService } from '@services/toast.service';
import { TransactionsService } from '@services/transactions.service';
import { UserService } from '@services/user.service';
import { DashboardLayoutComponent } from '@shared/layouts/dashboard-layout/dashboard-layout.component';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { Observable } from 'rxjs';
import { BalanceChartComponent } from '../dashboard/balance-chart/balance-chart.component';

@Component({
  selector: 'app-budgets',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
    DecimalPipe,
    SkeletonModule,
    SelectModule,
    ProgressBarModule,
    Dialog,
    InputNumber,
    DashboardLayoutComponent,
    HtCardComponent,
    HtButtonComponent,
    BalanceChartComponent
],
  providers: [UserService, TransactionsService, ToastService],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss',
})
export class BudgetsComponent implements OnInit {
  TYPE_EXPENSE_OPTIONS: Type[] = TYPE_EXPENSE_OPTIONS;
  FREQUENCY_OPTIONS: Frequency[] = FREQUENCY_OPTIONS;
  CURRENCY_OPTIONS = CURRENCY_OPTIONS;
  private destroyRef: DestroyRef = inject(DestroyRef);
  private loadingService: LoadingService = inject(LoadingService);
  private toastService: ToastService = inject(ToastService);
  private fb: FormBuilder = inject(FormBuilder);
  private userService: UserService = inject(UserService);
  private transactionsService: TransactionsService =
    inject(TransactionsService);
  expenses$: Observable<Transaction[] | null> =
    this.transactionsService.getExpenses();
  isLoading$: Observable<boolean> = this.transactionsService.getIsLoading();
  balance: Balance = {} as Balance;
  userId!: string;
  visible: boolean = false;
  isEdit: boolean = false;
  currency = 'VND';
  locale = 'vi-VN';
  budgetSelected!: Transaction;
  balancesThisYear!: number[];
  average!: number;
  lowest!: number;
  highest!: number;

  expenseForm: FormGroup = this.fb.group({
    id: [null],
    type: [null, Validators.required],
    currency: [null, Validators.required],
    amount: [{ value: null, disabled: true }, Validators.required],
    frequency: [null, Validators.required],
  });

  ngOnInit(): void {
    this.userId = this.userService.getUserId();
    this.getExpenses();
    this.getMonthlyBalance();
    this.getMonthlyBalancesThisYear();
    this.expenseForm
      .get('currency')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((selected) => {
        const currencyMeta = this.CURRENCY_OPTIONS.find(
          (opt) => opt.value === selected?.value
        );
        if (currencyMeta) {
          this.expenseForm.get('amount')?.reset();
          this.currency = currencyMeta.value;
          this.locale = currencyMeta.locale;
          this.expenseForm.get('amount')?.enable(); // enable when selected
        } else {
          this.expenseForm.get('amount')?.disable();
        }
      });
  }

  getExpenses(): void {
    this.transactionsService
      .getTransactionsById(this.userId, 'Expense')
      .subscribe();
    this.expenses$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((expenses: Transaction[] | null) => {
        if (!expenses?.length) return;
        this.budgetSelected = expenses[0];
      });
  }

  getMonthlyBalance(): void {
    this.transactionsService
      .getMonthlyBalanceByOffset(this.userId, 0)
      .subscribe((balance: Balance) => {
        this.balance = balance;
      });
  }

  getMonthlyBalancesThisYear(): void {
    this.transactionsService
      .getMonthlyBalancesThisYear(this.userId)
      .subscribe((balances: Balance[]) => {
        this.balancesThisYear = Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
          const record = balances.find(balance => balance.month === m);
          return record ? record.totalExpenses : 0;
        });
        const sum = this.balancesThisYear.reduce((acc, val) => acc + val, 0);
        this.average = sum/this.balancesThisYear.length;
        this.highest = Math.max(...this.balancesThisYear);
        this.lowest = Math.min(...this.balancesThisYear);
      });
  }

  closeDialog(): void {
    this.visible = false;
    this.isEdit = false;
    this.expenseForm.reset();
  }

  showEditDialog(): void {}

  addExpense(): void {
    this.loadingService.show();
    const addItem = {
      ...this.expenseForm.getRawValue(),
      transactionType: 'Expense',
    };
    this.transactionsService
      .createTransactionsById(this.userId, addItem)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.getExpenses();
          this.closeDialog();
        },
        error: () => {
          this.loadingService.hide();
          this.toastService.error('Error', `Please contact admin`);
        },
      });
  }

  editExpense(): void {}

  deleteExpense(): void {}
}
