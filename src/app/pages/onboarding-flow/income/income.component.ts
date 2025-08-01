import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumber } from 'primeng/inputnumber';
import { Menu } from 'primeng/menu';
import { HtButtonComponent } from '../../../components/ht-button/ht-button.component';
import { HtCardComponent } from '../../../components/ht-card/ht-card.component';
import {
  CURRENCY_OPTIONS,
  FREQUENCY_OPTIONS,
  TYPE_INCOME_OPTIONS,
} from '../../../enum/income.enum';
import {
  Currency,
  Frequency,
  Income,
  TypeIncome,
} from '../../../models/income.model';
import { OnboardingLayoutComponent } from '../../../shared/layouts/onboarding-layout/onboarding-layout.component';

@Component({
  selector: 'app-income',
  imports: [
    ReactiveFormsModule,
    Dialog,
    InputNumber,
    DropdownModule,
    Menu,
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
  private detroyRef: DestroyRef = inject(DestroyRef);
  incomes: Income[] = [
    {
      id: 0,
      type: {
        name: 'Business',
        icon: 'pi-building',
      },
      currency: {
        label: 'US Dollar (USD)',
        value: 'USD',
        locale: 'en-US',
      },
      amount: 12222,
      frequency: 'once',
    },
  ];
  incomeTitle: string = '';
  visible: boolean = false;
  isEdit: boolean = false;
  deleteVisible: boolean = false;
  deleteIncomeItem!: Income | null;
  selectedCurrency!: Currency;
  TYPE_INCOME_OPTIONS: TypeIncome[] = TYPE_INCOME_OPTIONS;
  FREQUENCY_OPTIONS: Frequency[] = FREQUENCY_OPTIONS;
  CURRENCY_OPTIONS = CURRENCY_OPTIONS;
  currency = 'VND';
  locale = 'vi-VN';

  incomeForm: FormGroup = this.fb.group({
    id: [null],
    type: [null, Validators.required],
    currency: [null, Validators.required],
    amount: [{ value: null, disabled: true }, Validators.required],
    frequency: [null, Validators.required],
  });

  ngOnInit() {
    this.incomeForm
      .get('currency')
      ?.valueChanges.pipe(takeUntilDestroyed(this.detroyRef))
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

  getMenuItems(item: Income): MenuItem[] {
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

  addIncome(): void {
    this.incomes.push({
      ...this.incomeForm.getRawValue(),
      id: this.incomes[this.incomes?.length - 1].id! + 1,
    });
    this.closeDialog();
  }

  showEditDiaLog(income: Income): void {
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
    const editedIncome = this.incomeForm.getRawValue();
    this.incomes = this.incomes.map((income: Income) => {
      if (income.id === editedIncome.id) {
        income = editedIncome;
      }
      return income;
    });
    this.closeDialog();
  }

  deleteIncome(): void {
    this.incomes = this.incomes.filter(
      (income) => income.id !== this.deleteIncomeItem?.id
    );
    this.closeDeleteDialog();
  }

  deleteDialog(visible: boolean, incomeItem: Income | null): void {
    this.deleteVisible = visible;
    this.deleteIncomeItem = incomeItem;
  }

  closeDeleteDialog(): void {
    this.deleteDialog(false, null);
  }
}
