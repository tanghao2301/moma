import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMask } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { HtButtonComponent } from '../../../components/ht-button/ht-button.component';

@Component({
  selector: 'app-personal-info',
  imports: [
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    InputMask,
    DatePickerModule,
    HtButtonComponent,
  ],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.scss',
})
export class PersonalInfoComponent {
  private fb = inject(FormBuilder);
  personalForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
  });

  onSubmit(): void {}
}
