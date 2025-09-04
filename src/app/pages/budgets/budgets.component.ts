import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HtButtonComponent } from '@components/ht-button/ht-button.component';
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import { CURRENCY_OPTIONS, FREQUENCY_OPTIONS, TYPE_EXPENSE_OPTIONS } from '@enum/transaction.enum';
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

@Component({
  selector: 'app-budgets',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
    SkeletonModule,
    SelectModule,
    ProgressBarModule,
    Dialog,
    InputNumber,
    DashboardLayoutComponent,
    HtCardComponent,
    HtButtonComponent,
  ],
  providers: [
    UserService,
    TransactionsService,
    ToastService
  ],
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
  userId!: string;
  visible: boolean = false;
  isEdit: boolean = false;
  currency = 'VND';
  locale = 'vi-VN';

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
      transactionType: 'Expense'
    }
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
