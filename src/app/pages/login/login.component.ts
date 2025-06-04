import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { HtButtonComponent } from '../../components/ht-button/ht-button.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    HtButtonComponent,
  ],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private destroyRef: DestroyRef = inject(DestroyRef);
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
    const rawForm = this.loginForm.getRawValue();
    this.authService.login(rawForm.email, rawForm.password).subscribe({
      next: (user) => {
        if (!user) return;
        if (user.income || user.expenses) {
          this.router.navigateByUrl('/dashboard');
        } else {
          this.router.navigateByUrl('/onboarding');
        }
      },
      error: (error) => {
        console.error('Email/Password Sign-In error:', error);
      },
    });
  }

  guestLogin(): void {
    const values = { email: 'guest@mail.uk', password: 'fake_password' };
    this.loginForm.patchValue(values);
    const subscription = this.loginForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.loginForm.valid) {
          subscription.unsubscribe();
          this.onSubmit();
        }
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
}
