import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HtButtonComponent } from '@components/ht-button/ht-button.component';
import { LoadingService } from '@services/loading.service';
import { ToastService } from '@services/toast.service';
import { UserService } from '@services/user.service';
import { LocaleService } from '@services/locale.service';
import { OnboardingLayoutComponent } from '@shared/layouts/onboarding-layout/onboarding-layout.component';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMask } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-personal-info',
  imports: [
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    InputMask,
    DatePickerModule,
    SelectModule,
    HtButtonComponent,
    OnboardingLayoutComponent,
  ],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.scss',
})
export class PersonalInfoComponent {
  private destroyRef: DestroyRef = inject(DestroyRef);
  private fb: FormBuilder = inject(FormBuilder);
  private userService: UserService = inject(UserService);
  private localeService: LocaleService = inject(LocaleService);
  private router: Router = inject(Router);
  private toastService: ToastService = inject(ToastService);
  private loadingService: LoadingService = inject(LoadingService);

  LANGUAGE_OPTIONS = [
    { label: 'English', value: 'en' },
    { label: 'Tiếng Việt', value: 'vi' }
  ];
  CURRENCY_OPTIONS = [
    { label: 'US Dollar (USD)', value: 'USD' },
    { label: 'Vietnamese Dong (VND)', value: 'VND' }
  ];

  personalForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    preferredLanguage: ['en', Validators.required],
    preferredCurrency: ['USD', Validators.required],
  });

  next(): void {
    if (this.personalForm.invalid) return;
    this.loadingService.show();
    const formVal = this.personalForm.getRawValue();
    const rawForm = {
      firstName: formVal.firstName,
      lastName: formVal.lastName,
      phoneNumber: formVal.phoneNumber,
      dateOfBirth: formVal.dateOfBirth,
      preferredLanguage: formVal.preferredLanguage,
      preferredCurrency: formVal.preferredCurrency,
      name: `${formVal.firstName} ${formVal.lastName}`,
      onboardingStep: 1
    };
    const user = JSON.parse(localStorage.getItem('user')!);
    if (!user) {
      this.toastService.error('Missing user id');
      return;
    }

    // Set settings on the LocaleService locally (without redundant concurrent DB writes)
    this.localeService.setLanguage(formVal.preferredLanguage!, false);
    this.localeService.setCurrency(formVal.preferredCurrency!, false);

    this.userService
      .updateUserById(user.uid, rawForm)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (_user) => {
          this.loadingService.hide();
          this.router.navigateByUrl('/onboarding/income');
        },
        error: (_error) => {
          this.loadingService.hide();
          this.toastService.error('Error', `Please contact admin`);
        },
      });
  }
}
