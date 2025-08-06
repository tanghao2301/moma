import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HtButtonComponent } from '@components/ht-button/ht-button.component';
import { AuthService } from '@services/auth.service';
import { LoadingService } from '@services/loading.service';
import { ToastService } from '@services/toast.service';
import { OnboardingLayoutComponent } from '@shared/layouts/onboarding-layout/onboarding-layout.component';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { take } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    HtButtonComponent,
    MessageModule,
    OnboardingLayoutComponent
  ],
  providers: [AuthService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private toastService: ToastService = inject(ToastService);
  private loadingService: LoadingService = inject(LoadingService);
  signupForm: FormGroup = this.fb.group(
    {
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  onSubmit(): void {
    this.loadingService.show();
    const rawForm = this.signupForm.getRawValue();
    this.authService
      .signup(rawForm.email, rawForm.password)
      .pipe(take(1))
      .subscribe({
        next: (user: any) => {
          this.router.navigateByUrl('/onboarding/personal-info');
          if (user) {
            localStorage.setItem('user', JSON.stringify({uid: user.uid}));
          }
        },
        error: (error) => {
          console.error('Email/Password Sign-In error:', error);
          this.toastService.error(
            'Error',
            `Invalid Login Credentials, Please try again`
          );
          this.loadingService.hide();
        },
        complete: () => {
          this.loadingService.hide();
        },
      });
  }

  async googleLogin(): Promise<void> {
    try {
      await this.authService.googleLogin();
    } catch (error) {
      console.error('Google login error', error);
      this.toastService.error('Error', `Google login error ${error}`);
    }
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }

  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { mismatch: true };
  }

  passwordStrengthValidator(control: AbstractControl) {
    if (!control?.value) return;
    const value = control.value;
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return pattern.test(value) ? null : { weakPassword: true };
  }
}
