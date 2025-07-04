import { Component } from '@angular/core';
import { Login } from '../../../../core/models/Login';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  model = {
    email: '',
    password: '',
  };
  apiError: string = '';
  constructor(private loginservice: AuthService, private router: Router) {}

  onSubmit(registerForm: any) {
    if (registerForm.valid) {
      this.loginservice.Login(this.model).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          // Navigate to home page after successful login
          sessionStorage.setItem('token', response.token);
          console.log('Token saved to sessionStorage:', response.token);

          this.router.navigateByUrl('home');
        },
        error: (error) => {
          console.error('Login failed', error);
          // Handle error, show message to user, etc.
          this.apiError = error.error?.message;
        },
      });
    }
  }
  externalLogin() {
    this.loginservice.initiateGoogleLogin();

    this.router.navigateByUrl('home');
  }
}
