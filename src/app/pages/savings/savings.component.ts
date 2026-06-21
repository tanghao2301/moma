import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HtButtonComponent } from '@components/ht-button/ht-button.component';
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import { CURRENCY_OPTIONS } from '@enum/transaction.enum';
import { Saving, SAVING_TYPE_OPTIONS, SavingType } from '@models/saving.model';
import { SavingsService } from '@services/savings.service';
import { LoadingService } from '@services/loading.service';
import { ToastService } from '@services/toast.service';
import { UserService } from '@services/user.service';
import { DashboardLayoutComponent } from '@shared/layouts/dashboard-layout/dashboard-layout.component';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
    SkeletonModule,
    SelectModule,
    Dialog,
    InputNumber,
    InputTextModule,
    TooltipModule,
    DashboardLayoutComponent,
    HtCardComponent,
    HtButtonComponent,
  ],
  providers: [SavingsService],
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.scss',
})
export class SavingsComponent implements OnInit {
  SAVING_TYPE_OPTIONS = SAVING_TYPE_OPTIONS;
  CURRENCY_OPTIONS = CURRENCY_OPTIONS;

  private destroyRef: DestroyRef = inject(DestroyRef);
  private loadingService: LoadingService = inject(LoadingService);
  private toastService: ToastService = inject(ToastService);
  private fb: FormBuilder = inject(FormBuilder);
  private userService: UserService = inject(UserService);
  private savingsService: SavingsService = inject(SavingsService);

  savings$: Observable<Saving[] | null> = this.savingsService.getSavings();
  isLoading$: Observable<boolean> = this.savingsService.getIsLoading();
  userId!: string;
  visible: boolean = false;
  deleteVisible: boolean = false;
  isEdit: boolean = false;
  savingSelected?: Saving;

  savingForm: FormGroup = this.fb.group({
    id: [null],
    name: [null, Validators.required],
    institution: [null, Validators.required],
    accountNumber: [null],
    balance: [null, [Validators.required, Validators.min(0)]],
    currency: [null, Validators.required],
    interestRate: [null, [Validators.min(0)]],
    type: [SavingType.SAVINGS_ACCOUNT, Validators.required],
  });

  ngOnInit(): void {
    this.userId = this.userService.getUserId();
    this.fetchSavings();
  }

  fetchSavings(): void {
    this.savingsService.fetchSavings(this.userId).subscribe();
  }

  showAddDialog(): void {
    this.isEdit = false;
    this.savingSelected = undefined;
    this.savingForm.reset({
      balance: 0,
      type: SavingType.SAVINGS_ACCOUNT,
    });
    if (this.CURRENCY_OPTIONS.length > 0) {
       this.savingForm.get('currency')?.setValue(this.CURRENCY_OPTIONS[0]);
    }
    this.visible = true;
  }

  showEditDialog(saving: Saving): void {
    this.isEdit = true;
    this.savingSelected = saving;
    
    this.savingForm.patchValue({
      id: saving.id,
      name: saving.name,
      institution: saving.institution,
      accountNumber: saving.accountNumber,
      balance: saving.balance,
      currency: this.CURRENCY_OPTIONS.find(opt => opt.value === saving.currency),
      interestRate: saving.interestRate,
      type: saving.type
    });
    this.visible = true;
  }

  showDeleteDialog(saving: Saving): void {
    this.savingSelected = saving;
    this.deleteVisible = true;
  }

  closeDialog(): void {
    this.visible = false;
    this.deleteVisible = false;
    this.savingSelected = undefined;
    this.savingForm.reset();
  }

  saveSaving(): void {
    if (this.savingForm.invalid) return;

    this.loadingService.show();
    const formValue = this.savingForm.getRawValue();
    const savingData: any = {
      name: formValue.name,
      institution: formValue.institution,
      accountNumber: formValue.accountNumber,
      balance: formValue.balance,
      currency: formValue.currency.value,
      interestRate: formValue.interestRate,
      type: formValue.type,
    };

    const action = this.isEdit 
      ? this.savingsService.updateSaving(this.userId, formValue.id, savingData)
      : this.savingsService.addSaving(this.userId, savingData);

    action.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loadingService.hide();
        this.toastService.success('Success', `Savings record ${this.isEdit ? 'updated' : 'added'} successfully`);
        this.visible = false;
      },
      error: (err) => {
        this.loadingService.hide();
        this.toastService.error('Error', `Failed to ${this.isEdit ? 'update' : 'add'} savings record`);
        console.error(err);
      }
    });
  }

  confirmDelete(): void {
    if (!this.savingSelected?.id) return;

    this.loadingService.show();
    this.savingsService.deleteSaving(this.userId, this.savingSelected.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.toastService.success('Success', 'Savings record deleted successfully');
          this.deleteVisible = false;
        },
        error: (err) => {
          this.loadingService.hide();
          this.toastService.error('Error', 'Failed to delete savings record');
          console.error(err);
        }
      });
  }

  getTypeIcon(typeValue: string): string {
    const option = this.SAVING_TYPE_OPTIONS.find(opt => opt.value === typeValue);
    return option ? option.icon : 'pi-wallet';
  }
}
