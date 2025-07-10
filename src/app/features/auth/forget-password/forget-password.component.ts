import { Component } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  form: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.authService.forgetPassword(this.form.value).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Reset Link Sent',
            text: res.message || 'Check your email to reset your password',
          });
          this.isLoading = false;
          this.form.reset();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.message || 'Something went wrong',
          });
          this.isLoading = false;
        },
      });
    }
  }
}
