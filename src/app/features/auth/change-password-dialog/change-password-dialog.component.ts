import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css'],
})
export class ChangePasswordDialogComponent {
  passwordForm: FormGroup;
  isSubmitting = false;
  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';
  minLength = false;
  hasUpper = false;
  hasLower = false;
  hasNumber = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private accountService: AuthService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }
  onPasswordInput() {
    const password = this.passwordForm.get('newPassword')?.value || '';
    this.minLength = password.length >= 8;
    this.hasUpper = /[A-Z]/.test(password);
    this.hasLower = /[a-z]/.test(password);
    this.hasNumber = /[0-9]/.test(password);

    const passed =
      Number(this.minLength) +
      Number(this.hasUpper) +
      Number(this.hasLower) +
      Number(this.hasNumber);

    if (passed <= 1) this.passwordStrength = 'weak';
    else if (passed === 2 || passed === 3) this.passwordStrength = 'medium';
    else this.passwordStrength = 'strong';
  }

  submit() {
    if (this.passwordForm.invalid) return;

    this.accountService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        Swal.fire('Success', 'Password changed successfully!', 'success');
        this.dialogRef.close();
      },
      error: (err) => {
        Swal.fire(
          'Error',
          err?.error?.message || 'Something went wrong',
          'error'
        );
      },
    });
  }
}
