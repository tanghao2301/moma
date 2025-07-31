import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumber } from 'primeng/inputnumber';
import { HtButtonComponent } from '../../../components/ht-button/ht-button.component';
import { HtCardComponent } from '../../../components/ht-card/ht-card.component';
import { CURRENCY_OPTIONS, FREQUENCY_OPTIONS, TYPE_INCOME_OPTIONS } from '../../../enum/income.enum';
import { Currency, Frequency, Income, TypeIncome } from '../../../models/income.model';
import { OnboardingLayoutComponent } from '../../../shared/layouts/onboarding-layout/onboarding-layout.component';

@Component({
  selector: 'app-income',
  imports: [
    ReactiveFormsModule,
    Dialog,
    InputNumber,
    DropdownModule,
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
  incomes: Income[] = [];
  incomeTitle: string = '';
  visible: boolean = false;
  selectedCurrency!: Currency;
  TYPE_INCOME_OPTIONS: TypeIncome[] = TYPE_INCOME_OPTIONS;
  FREQUENCY_OPTIONS: Frequency[] = FREQUENCY_OPTIONS;
  CURRENCY_OPTIONS = CURRENCY_OPTIONS;
  currency = 'VND';
  locale = 'vi-VN';
  incomeForm: FormGroup = this.fb.group({
    type: [null],
    currency: [null],
    amount: [{ value: null, disabled: true }],
    frequency: [null]
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

  showDialog() {
    this.visible = true;
  }

  addIncome(): void {
    // {
    //   "type": {
    //       "type": "Business",
    //       "icon": "pi-building"
    //   },
    //   "currency": {
    //       "label": "US Dollar (USD)",
    //       "value": "USD",
    //       "locale": "en-US"
    //   },
    //   "amount": 12222,
    //   "frequency": "once"
    // }
    this.incomes.push(this.incomeForm.getRawValue());
    this.visible = false;
  }

  handleDialogClose(): void {
    this.incomeForm.reset();
  }
}
