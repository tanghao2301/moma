import {
  AsyncPipe,
  CommonModule,
  CurrencyPipe,
  DatePipe,
} from '@angular/common';
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
import { HtTableComponent } from '@components/ht-table/ht-table.component';
import { HtTableHeader, HtTableHeaderDirective } from '@components/ht-table/elements/ht-table-header.directive';
import { HtTableRow } from '@components/ht-table/elements/ht-table-row.directive';
import { HtTableCellDirective } from '@components/ht-table/elements/ht-table-cell.directive';
import {
  FREQUENCY_OPTIONS,
  TYPE_INSTALLMENT_OPTIONS,
} from '@enum/transaction.enum';
import { LocaleService } from '@services/locale.service';
import { Transaction, Type } from '@models/transaction.model';
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
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-installment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    SkeletonModule,
    SelectModule,
    ProgressBarModule,
    Dialog,
    InputNumber,
    InputTextModule,
    DashboardLayoutComponent,
    HtCardComponent,
    HtButtonComponent,
    HtTableComponent,
    HtTableHeader,
    HtTableHeaderDirective,
    HtTableRow,
    HtTableCellDirective,
  ],
  templateUrl: './installment.component.html',
  styleUrl: './installment.component.scss',
})
export class InstallmentComponent implements OnInit {
  public localeService = inject(LocaleService);
  TYPE_INSTALLMENT_OPTIONS: Type[] = TYPE_INSTALLMENT_OPTIONS;
  FREQUENCY_OPTIONS = FREQUENCY_OPTIONS;
  
  private destroyRef: DestroyRef = inject(DestroyRef);
  private loadingService: LoadingService = inject(LoadingService);
  private toastService: ToastService = inject(ToastService);
  private fb: FormBuilder = inject(FormBuilder);
  private userService: UserService = inject(UserService);
  private transactionsService: TransactionsService = inject(TransactionsService);
  
  installments$: Observable<Transaction[] | null> = this.transactionsService.getInstallments();
  isLoading$: Observable<boolean> = this.transactionsService.getIsLoading();
  
  userId!: string;
  visible: boolean = false;
  deleteVisible: boolean = false;
  isEdit: boolean = false;
  currency = 'VND';
  locale = 'vi-VN';
  selectedInstallment: Transaction | null = null;
  
  // Stats
  totalRemainingBalance: number = 0;
  nextPaymentDate: Date | null = null;
  activeInstallmentsCount: number = 0;

  installmentForm: FormGroup = this.fb.group({
    id: [null],
    type: [null, Validators.required],
    amount: [null, Validators.required],
    totalAmount: [null, Validators.required],
    frequency: [null, Validators.required],
    note: ['']
  });

  ngOnInit(): void {
    this.userId = this.userService.getUserId();
    this.getInstallments();
    
    this.installments$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(items => {
      if (items && items.length > 0) {
        this.selectedInstallment = items[0];
        this.activeInstallmentsCount = items.length;
        this.totalRemainingBalance = items.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        // Mock next payment date for visualization
        this.nextPaymentDate = new Date();
        this.nextPaymentDate.setDate(15);
      }
    });
  }

  getInstallments(): void {
    this.transactionsService.getTransactionsById(this.userId, 'Installment').subscribe();
  }

  closeDialog(): void {
    this.visible = false;
    this.deleteVisible = false;
    this.isEdit = false;
    this.installmentForm.reset();
  }

  showEditDialog(installment: Transaction): void {
    this.installmentForm.patchValue({
      id: installment.id,
      type: installment.type,
      amount: installment.amount,
      totalAmount: (installment as any).totalAmount,
      frequency: installment.frequency,
      note: installment.note
    });
    this.isEdit = true;
    this.visible = true;
  }

  addInstallment(): void {
    this.loadingService.show();
    const formVal = this.installmentForm.getRawValue();
    const activeCurrency = this.localeService.activeCurrency();
    const activeLocale = this.localeService.activeLocale();
    const addItem = {
      ...formVal,
      currency: {
        value: activeCurrency,
        locale: activeLocale,
        label: activeCurrency === 'USD' ? 'US Dollar (USD)' : 'Vietnamese Dong (VND)'
      },
      transactionType: 'Installment',
    };
    this.transactionsService.createTransactionsById(this.userId, addItem)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.getInstallments();
          this.closeDialog();
        },
        error: () => {
          this.loadingService.hide();
          this.toastService.error('Error', `Please contact admin`);
        },
      });
  }

  editInstallment(): void {
    this.loadingService.show();
    const formVal = this.installmentForm.getRawValue();
    const activeCurrency = this.localeService.activeCurrency();
    const activeLocale = this.localeService.activeLocale();
    const updateItem = {
      ...formVal,
      currency: {
        value: activeCurrency,
        locale: activeLocale,
        label: activeCurrency === 'USD' ? 'US Dollar (USD)' : 'Vietnamese Dong (VND)'
      }
    };
    this.transactionsService.updateTransactionsById(
      this.userId,
      this.installmentForm.get('id')?.value,
      updateItem
    ).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.getInstallments();
          this.closeDialog();
        },
        error: () => {
          this.loadingService.hide();
          this.toastService.error('Error', `Please contact admin`);
        },
      });
  }

  calculateProgress(item: Transaction): number {
    // Mock progress calculation
    if (!item.amount) return 0;
    return Math.floor(Math.random() * 100); 
  }

  getMockSchedule(): any[] {
    return [
      { period: '1 of 12', date: new Date('2023-08-15'), status: 'Paid', amount: 83.25 },
      { period: '2 of 12', date: new Date('2023-09-15'), status: 'Paid', amount: 83.25 },
      { period: '3 of 12', date: new Date('2023-10-15'), status: 'Next', amount: 83.25 },
      { period: '4 of 12', date: new Date('2023-11-15'), status: 'Upcoming', amount: 83.25 },
      { period: '5 of 12', date: new Date('2023-12-15'), status: 'Upcoming', amount: 83.25 },
    ];
  }

  deleteInstallment(): void {
    this.loadingService.show();
    const formVal = this.installmentForm.getRawValue();
    const activeCurrency = this.localeService.activeCurrency();
    const activeLocale = this.localeService.activeLocale();
    const deleteItem = {
      ...formVal,
      currency: {
        value: activeCurrency,
        locale: activeLocale,
        label: activeCurrency === 'USD' ? 'US Dollar (USD)' : 'Vietnamese Dong (VND)'
      }
    };
    this.transactionsService.deleteTransactionsById(
      this.userId,
      this.installmentForm.get('id')?.value,
      deleteItem
    ).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.getInstallments();
          this.closeDialog();
        },
        error: () => {
          this.loadingService.hide();
          this.toastService.error('Error', `Please contact admin`);
        },
      });
  }
}
