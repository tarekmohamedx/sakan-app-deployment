import { Component } from '@angular/core';
import { Login } from '../../../../core/models/Login';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
  isLoading: boolean = false;

  constructor(private loginservice: AuthService, private router: Router) {}

  onSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      this.isLoading = true; // Set loading state
      this.loginservice.Login(this.model).subscribe({
        next: (response) => {
          console.log('Login successful', response);
         

          sessionStorage.setItem('token', response.token);
          console.log('user role', response.role);
          console.log('user role', this.loginservice.getuserdata()?.role);
          this.loginservice.notifyLogin(); // <--- trigger user update

          this.router.navigateByUrl('host');
        },
        error: (error) => {
          console.error('Login failed', error);

          // If error is a string
          if (typeof error.error === 'string') {
            this.apiError = error.error;
          }

          // If error is an object with a message
          else if (error.error?.message) {
            this.apiError = error.error.message;
          }

          // If error is an array of messages (e.g. validation errors)
          else if (Array.isArray(error.error)) {
            this.apiError = error.error.join('\n');
          }

          // Fallback message
          else {
            this.apiError = 'An unexpected error occurred. Please try again.';
          }
          this.isLoading = false;
        },
        // complete: () => {
        //   this.isLoading = false; // Reset loading state
        // },
      });
    }
  }

  externalLogin() {
    this.loginservice.initiateGoogleLogin();

    this.router.navigateByUrl('hometest');
  }
}
