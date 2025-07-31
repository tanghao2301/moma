import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { HtButtonComponent } from '../../components/ht-button/ht-button.component';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { OnboardingLayoutComponent } from '../../shared/layouts/onboarding-layout/onboarding-layout.component';

@Component({
  selector: 'app-login',
  imports: [
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    HtButtonComponent,
    OnboardingLayoutComponent
  ],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private toastService: ToastService = inject(ToastService);
  private loadingService: LoadingService = inject(LoadingService);
  loginForm: FormGroup = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    this.authService.logout().subscribe();
    localStorage.clear();
  }

  onSubmit(): void {
    this.loadingService.show();
    const rawForm = this.loginForm.getRawValue();
    this.authService.login(rawForm.email, rawForm.password).subscribe({
      next: (user) => {
        this.loadingService.hide();
        if (user) {
          localStorage.setItem(
            'user',
            JSON.stringify(user || {})
          );
        }
        if (user?.income || user?.expenses) {
          this.router.navigateByUrl('/dashboard');
        } else {
          this.router.navigateByUrl('/onboarding/personal-info');
        }
      },
      error: (error) => {
        this.loadingService.hide();
        console.error('Email/Password Sign-In error:', error);
        this.toastService.error(
          'Error',
          `Invalid Login Credentials, Please try again`
        );
      }
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
}
