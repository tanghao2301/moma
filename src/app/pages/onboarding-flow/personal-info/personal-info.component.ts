import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMask } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { HtButtonComponent } from '../../../components/ht-button/ht-button.component';
import { LoadingService } from '../../../services/loading.service';
import { ToastService } from '../../../services/toast.service';
import { UserService } from '../../../services/user.service';
import { OnboardingLayoutComponent } from '../../../shared/layouts/onboarding-layout/onboarding-layout.component';

@Component({
  selector: 'app-personal-info',
  imports: [
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    InputMask,
    DatePickerModule,
    HtButtonComponent,
    OnboardingLayoutComponent
  ],
  providers: [UserService],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.scss',
})
export class PersonalInfoComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  private toastService: ToastService = inject(ToastService);
  private loadingService: LoadingService = inject(LoadingService);
  personalForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
  });

  onSubmit(): void {
    this.loadingService.show();
    const rawForm = this.personalForm.getRawValue();
    const user = JSON.parse(localStorage.getItem('user')!);
    if (!user) return;
    this.userService.updateUserById(user.uid, rawForm).subscribe({
      next: (_user) => {
        this.loadingService.hide();
        this.router.navigateByUrl('/onboarding/income');
      },
      error: (_error) => {
        this.loadingService.hide();
        this.toastService.error(
          'Error',
          `Please contact admin`
        );
      }
    });
  }
}
