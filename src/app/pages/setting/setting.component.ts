import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '@services/user.service';
import { ToastService } from '@services/toast.service';
import { LoadingService } from '@services/loading.service';
import { DashboardLayoutComponent } from '@shared/layouts/dashboard-layout/dashboard-layout.component';
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import { HtButtonComponent } from '@components/ht-button/ht-button.component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { UserModel } from '@models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardLayoutComponent,
    HtCardComponent,
    HtButtonComponent,
    InputTextModule,
    FloatLabelModule,
    ToastModule,
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private loadingService = inject(LoadingService);
  private destroyRef = inject(DestroyRef);

  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
  });

  currentUser: UserModel | null = null;

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const uid = this.userService.getUserId();
    if (!uid) return;

    this.loadingService.show();
    this.userService.getUserById(uid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.currentUser = user;
          if (user) {
            this.userForm.patchValue({
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              phoneNumber: user.phoneNumber || '',
            });
          }
          this.loadingService.hide();
        },
        error: () => {
          this.toastService.error('Error', 'Failed to load user data');
          this.loadingService.hide();
        }
      });
  }

  saveProfile(): void {
    if (this.userForm.invalid) return;

    const uid = this.userService.getUserId();
    if (!uid) return;

    this.loadingService.show();
    const formValue = this.userForm.getRawValue();
    const updateData: Partial<UserModel> = {
      firstName: formValue.firstName || '',
      lastName: formValue.lastName || '',
      phoneNumber: formValue.phoneNumber || '',
      name: `${formValue.firstName} ${formValue.lastName}`.trim(),
    };

    this.userService.updateUserById(uid, updateData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success('Success', 'Profile updated successfully');
          this.loadingService.hide();
        },
        error: () => {
          this.toastService.error('Error', 'Failed to update profile');
          this.loadingService.hide();
        }
      });
  }
}
