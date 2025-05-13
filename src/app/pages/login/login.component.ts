import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { HtButtonComponent } from '../../components/ht-button/ht-button.component';
@Component({
  selector: 'app-login',
  imports: [FloatLabelModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, HtButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private _fb = inject(FormBuilder);
  loginForm: FormGroup = this._fb.group({
    email: [''],
    password: ['']
  })
}
