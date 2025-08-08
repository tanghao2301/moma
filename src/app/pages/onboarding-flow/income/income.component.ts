import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HtButtonComponent } from '@components/ht-button/ht-button.component';
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import {
  CURRENCY_OPTIONS,
  FREQUENCY_OPTIONS,
  TYPE_INCOME_OPTIONS,
} from '@enum/income.enum';
import { Currency, Frequency, Transaction, Type } from '@models/transaction.model';
import { LoadingService } from '@services/loading.service';
import { ToastService } from '@services/toast.service';
import { TransactionsService } from '@services/transactions.service';
import { UserService } from '@services/user.service';
import { OnboardingLayoutComponent } from '@shared/layouts/onboarding-layout/onboarding-layout.component';
import { MenuItem } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { Menu } from 'primeng/menu';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-income',
  imports: [
    ReactiveFormsModule,
    Dialog,
    InputNumber,
    SelectModule,
    SkeletonModule,
    Menu,
    AsyncPipe,
    OnboardingLayoutComponent,
    HtCardComponent,
    HtButtonComponent,
    CurrencyPipe,
  ],
  templateUrl: './income.component.html',
  styleUrl: './income.component.sass',
})
export class IncomeComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private router: Router = inject(Router);
  private toastService: ToastService = inject(ToastService);
  private loadingService: LoadingService = inject(LoadingService);
  private userService: UserService = inject(UserService);
  private incomesService: TransactionsService = inject(TransactionsService);
  incomes$: Observable<Transaction[] | null> = this.incomesService.getTransactions();
  isLoading$: Observable<boolean> = this.incomesService.getIsLoading();
  incomeTitle: string = '';
  visible: boolean = false;
  isEdit: boolean = false;
  deleteVisible: boolean = false;
  deleteIncomeItem!: Transaction | null;
  selectedCurrency!: Currency;
  TYPE_INCOME_OPTIONS: Type[] = TYPE_INCOME_OPTIONS;
  FREQUENCY_OPTIONS: Frequency[] = FREQUENCY_OPTIONS;
  CURRENCY_OPTIONS = CURRENCY_OPTIONS;
  currency = 'VND';
  locale = 'vi-VN';
  userId!: string;

  incomeForm: FormGroup = this.fb.group({
    id: [null],
    type: [null, Validators.required],
    currency: [null, Validators.required],
    amount: [{ value: null, disabled: true }, Validators.required],
    frequency: [null, Validators.required],
  });

  ngOnInit() {
    this.userId = this.userService.getUserId();
    this.getIncomes();
    this.incomeForm
      .get('currency')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((selected) => {
        const currencyMeta = this.CURRENCY_OPTIONS.find(
          (opt) => opt.value === selected?.value
        );
        if (currencyMeta) {
          this.incomeForm.get('amount')?.reset();
          this.currency = currencyMeta.value;
          this.locale = currencyMeta.locale;
          this.incomeForm.get('amount')?.enable(); // enable when selected
        } else {
          this.incomeForm.get('amount')?.disable();
        }
      });
  }

  getMenuItems(item: Transaction): MenuItem[] {
    return [
      {
        label: 'Options',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-pencil',
            command: () => this.showEditDiaLog(item),
          },
          {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => {
              this.deleteDialog(true, item);
            },
          },
        ],
      },
    ];
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog(): void {
    this.visible = false;
    this.isEdit = false;
    this.incomeForm.reset();
  }

  getIncomes(): void {
    this.incomesService
      .getTransactionsById(this.userId, 'Income')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  addIncome(): void {
    this.loadingService.show();
    const addItem = {
      ...this.incomeForm.getRawValue(),
      transactionType: 'Income'
    }
    this.incomesService
      .createTransactionsById(this.userId, addItem)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.getIncomes();
          this.closeDialog();
        },
        error: () => {
          this.loadingService.hide();
          this.toastService.error('Error', `Please contact admin`);
        },
      });
  }

  showEditDiaLog(income: Transaction): void {
    this.incomeForm.setValue({
      id: income.id,
      type: income.type,
      currency: income.currency,
      amount: income.amount,
      frequency: income.frequency,
    });
    this.isEdit = true;
    this.showDialog();
  }

  editIncome(): void {
    this.loadingService.show();
    this.incomesService
      .updateTransactionsById(
        this.userId,
        this.incomeForm.get('id')?.value,
        this.incomeForm.getRawValue()
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.getIncomes();
          this.closeDialog();
        },
        error: () => {
          this.loadingService.hide();
          this.toastService.error('Error', `Please contact admin`);
        },
      });
  }

  deleteIncome(): void {
    if (!this.deleteIncomeItem?.id) return;
    this.loadingService.show();
    this.incomesService
      .deleteTransactionsById(this.userId, this.deleteIncomeItem?.id, this.deleteIncomeItem)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.getIncomes();
          this.closeDeleteDialog();
        },
        error: () => {
          this.loadingService.hide();
          this.toastService.error('Error', `Please contact admin`);
        },
      });
  }

  deleteDialog(visible: boolean, incomeItem: Transaction | null): void {
    this.deleteVisible = visible;
    this.deleteIncomeItem = incomeItem;
  }

  closeDeleteDialog(): void {
    this.deleteDialog(false, null);
  }

  next(): void {
    this.loadingService.show();
    if (!this.userId) {
      this.toastService.error('Missing user id');
      return;
    }
    this.userService
      .updateUserById(this.userId, { onboardingStep: 2 })
      .subscribe({
        next: (_user) => {
          this.loadingService.hide();
          this.router.navigateByUrl('/dashboard');
        },
        error: (_error) => {
          this.loadingService.hide();
          this.toastService.error('Error', `Please contact admin`);
        },
      });
  }
}
