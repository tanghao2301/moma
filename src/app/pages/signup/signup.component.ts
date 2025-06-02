import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { HtButtonComponent } from '../../components/ht-button/ht-button.component';
import { AuthService } from '../../services/auth.service';

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
  ],
  providers: [AuthService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
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
    const rawForm = this.signupForm.getRawValue();
    this.authService.signup(rawForm.email, rawForm.password).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        console.error('Email/Password Sign-In error:', error);
      },
    });
  }

  async googleLogin(): Promise<void> {
    try {
      await this.authService.googleLogin();
      this.router.navigateByUrl('/dashboard');
    } catch (error) {
      console.error('Google login error', error);
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
