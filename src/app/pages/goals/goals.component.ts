import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CURRENCY_OPTIONS } from '@enum/transaction.enum';
import { Goal, GOAL_ICON_OPTIONS, GOAL_STATUS_OPTIONS, GoalStatus } from '@models/goal.model';
import { GoalsService } from '@services/goals.service';
import { LoadingService } from '@services/loading.service';
import { ToastService } from '@services/toast.service';
import { UserService } from '@services/user.service';
import { HtButtonComponent } from '@components/ht-button/ht-button.component';
import { DashboardLayoutComponent } from '@shared/layouts/dashboard-layout/dashboard-layout.component';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsyncPipe,
    CurrencyPipe,
    SkeletonModule,
    SelectModule,
    ProgressBarModule,
    Dialog,
    InputNumber,
    InputTextModule,
    DatePickerModule,
    TooltipModule,
    DashboardLayoutComponent,
    HtButtonComponent,
  ],
  providers: [GoalsService],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss',
})
export class GoalsComponent implements OnInit {
  GOAL_ICON_OPTIONS = GOAL_ICON_OPTIONS;
  GOAL_STATUS_OPTIONS = GOAL_STATUS_OPTIONS;
  CURRENCY_OPTIONS = CURRENCY_OPTIONS;

  private destroyRef: DestroyRef = inject(DestroyRef);
  private loadingService: LoadingService = inject(LoadingService);
  private toastService: ToastService = inject(ToastService);
  private fb: FormBuilder = inject(FormBuilder);
  private userService: UserService = inject(UserService);
  private goalsService: GoalsService = inject(GoalsService);

  goals$: Observable<Goal[] | null> = this.goalsService.getGoals();
  isLoading$: Observable<boolean> = this.goalsService.getIsLoading();
  userId!: string;
  showFormView: boolean = false;
  deleteVisible: boolean = false;
  isEdit: boolean = false;
  goalSelected?: Goal;

  goalForm: FormGroup = this.fb.group({
    id: [null],
    name: [null, Validators.required],
    targetAmount: [null, [Validators.required, Validators.min(0.01)]],
    currentAmount: [0, [Validators.required, Validators.min(0)]],
    currency: [null, Validators.required],
    targetDate: [null],
    icon: [null],
    color: ['#4f46e5'],
    status: [GoalStatus.IN_PROGRESS, Validators.required],
  });

  ngOnInit(): void {
    this.userId = this.userService.getUserId();
    this.fetchGoals();
  }

  fetchGoals(): void {
    this.goalsService.fetchGoals(this.userId).subscribe();
  }

  showAddDialog(): void {
    this.isEdit = false;
    this.goalSelected = undefined;
    this.goalForm.reset({
      currentAmount: 0,
      icon: this.GOAL_ICON_OPTIONS.find(opt => opt.value === 'pi-wallet'),
      color: '#4f46e5',
      status: GoalStatus.IN_PROGRESS,
    });
    // Set default currency if options are available
    if (this.CURRENCY_OPTIONS.length > 0) {
       this.goalForm.get('currency')?.setValue(this.CURRENCY_OPTIONS[0]);
    }
    this.showFormView = true;
  }

  showEditDialog(goal: Goal): void {
    this.isEdit = true;
    this.goalSelected = goal;
    
    this.goalForm.patchValue({
      id: goal.id,
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      currency: this.CURRENCY_OPTIONS.find(opt => opt.value === goal.currency),
      targetDate: goal.targetDate ? new Date(goal.targetDate) : null,
      icon: this.GOAL_ICON_OPTIONS.find(opt => opt.value === goal.icon),
      color: goal.color,
      status: goal.status
    });
    this.showFormView = true;
  }

  showDeleteDialog(goal: Goal): void {
    this.goalSelected = goal;
    this.deleteVisible = true;
  }

  closeDialog(): void {
    this.showFormView = false;
    this.deleteVisible = false;
    this.goalSelected = undefined;
    this.goalForm.reset();
  }

  saveGoal(): void {
    if (this.goalForm.invalid) return;

    this.loadingService.show();
    const formValue = this.goalForm.getRawValue();
    const goalData: any = {
      name: formValue.name,
      targetAmount: formValue.targetAmount,
      currentAmount: formValue.currentAmount,
      currency: formValue.currency.value,
      targetDate: formValue.targetDate ? new Date(formValue.targetDate).getTime() : null,
      icon: formValue.icon.value,
      color: formValue.color,
      status: formValue.status,
    };

    const action = this.isEdit 
      ? this.goalsService.updateGoal(this.userId, formValue.id, goalData)
      : this.goalsService.addGoal(this.userId, goalData);

    action.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loadingService.hide();
        this.toastService.success('Success', `Goal ${this.isEdit ? 'updated' : 'added'} successfully`);
        this.showFormView = false;
      },
      error: (err) => {
        this.loadingService.hide();
        this.toastService.error('Error', `Failed to ${this.isEdit ? 'update' : 'add'} goal`);
        console.error(err);
      }
    });
  }

  confirmDelete(): void {
    if (!this.goalSelected?.id) return;

    this.loadingService.show();
    this.goalsService.deleteGoal(this.userId, this.goalSelected.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadingService.hide();
          this.toastService.success('Success', 'Goal deleted successfully');
          this.deleteVisible = false;
        },
        error: (err) => {
          this.loadingService.hide();
          this.toastService.error('Error', 'Failed to delete goal');
          console.error(err);
        }
      });
  }

  calculateProgress(goal: Goal): number {
    if (!goal.targetAmount || goal.targetAmount === 0) return 0;
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return Math.min(Math.round(progress), 100);
  }

  getRemainingAmount(goal: Goal): number {
    return Math.max(goal.targetAmount - goal.currentAmount, 0);
  }

  getGoalIcon(iconValue: string): string {
    const option = this.GOAL_ICON_OPTIONS.find(opt => opt.value === iconValue);
    return option ? option.value : 'pi-wallet';
  }

  getStatusIcon(statusValue: string): string {
    const option = this.GOAL_STATUS_OPTIONS.find(opt => opt.value === statusValue);
    return option ? option.icon : 'pi-question-circle';
  }

  get timeRemaining(): string {
    const targetDate = this.goalForm.get('targetDate')?.value;
    if (!targetDate) return 'Select target date to calculate';
    
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - now.getTime();
    if (diffTime <= 0) return 'Passed target date';
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 30) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    }
    
    const diffMonths = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} left`;
  }

  get monthlyMilestone(): number {
    const targetAmount = this.goalForm.get('targetAmount')?.value || 0;
    const currentAmount = this.goalForm.get('currentAmount')?.value || 0;
    const targetDate = this.goalForm.get('targetDate')?.value;
    if (!targetDate || targetAmount <= currentAmount) return 0;
    
    const now = new Date();
    const target = new Date(targetDate);
    let diffMonths = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    if (diffMonths <= 0) diffMonths = 1;
    
    return (targetAmount - currentAmount) / diffMonths;
  }
}
