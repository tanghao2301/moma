import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-signup',
  imports: [
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    HtButtonComponent,
  ],
  providers: [AuthService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private _fb = inject(FormBuilder);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  signupForm: FormGroup = this._fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

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
}
