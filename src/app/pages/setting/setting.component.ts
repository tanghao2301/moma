import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '@services/user.service';
import { ToastService } from '@services/toast.service';
import { LoadingService } from '@services/loading.service';
import { LocaleService } from '@services/locale.service';
import { DashboardLayoutComponent } from '@shared/layouts/dashboard-layout/dashboard-layout.component';
import { HtCardComponent } from '@components/ht-card/ht-card.component';
import { HtButtonComponent } from '@components/ht-button/ht-button.component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
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
    SelectModule,
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private loadingService = inject(LoadingService);
  private localeService = inject(LocaleService);
  private destroyRef = inject(DestroyRef);

  LANGUAGE_OPTIONS = [
    { label: 'English', value: 'en' },
    { label: 'Tiếng Việt', value: 'vi' }
  ];
  CURRENCY_OPTIONS = [
    { label: 'US Dollar (USD)', value: 'USD' },
    { label: 'Vietnamese Dong (VND)', value: 'VND' }
  ];

  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    preferredLanguage: ['en', Validators.required],
    preferredCurrency: ['USD', Validators.required],
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
              preferredLanguage: user.preferredLanguage || 'en',
              preferredCurrency: user.preferredCurrency || 'USD',
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
      preferredLanguage: formValue.preferredLanguage || 'en',
      preferredCurrency: formValue.preferredCurrency || 'USD',
    };

    // Update LocaleService immediately
    this.localeService.setLanguage(formValue.preferredLanguage || 'en');
    this.localeService.setCurrency(formValue.preferredCurrency || 'USD');

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
