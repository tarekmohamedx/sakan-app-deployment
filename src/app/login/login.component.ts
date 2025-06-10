import { Component } from '@angular/core';
import { Login } from '../core/models/Login';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  model!: Login;
  apiError: string | null = null;
  constructor(private loginservice: AuthService, private router: Router) {}

  onSubmit(registerForm: any) {
    if (registerForm.valid) {
      this.loginservice.Login(this.model).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          // Navigate to home page after successful login
          sessionStorage.setItem('token', response.token);
          console.log('Token saved to sessionStorage:', response.token);

          this.router.navigateByUrl('hometest');
        },
        error: (error) => {
          console.error('Login failed', error);
          // Handle error, show message to user, etc.
          this.apiError = error.error?.message;
        },
      });
    }
  }
}
