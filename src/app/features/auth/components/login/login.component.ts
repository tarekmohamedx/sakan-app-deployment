import { Component, OnInit } from '@angular/core';
import { Login } from '../../../../core/models/Login';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule , RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent implements OnInit {
  model = {
    email: '',
    password: '',
  };
  apiError: string = '';
  isLoading: boolean = false;

  constructor(private loginservice: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.renderGoogleSignInButton(); 
  }

  // onSubmit(registerForm: any) {
  //   if (registerForm.valid) {
  //     this.loginservice.Login(this.model).subscribe({
  //       next: (response) => {
  //         console.log('Login successful', response);
  //         // Navigate to home page after successful login
  //         sessionStorage.setItem('token', response.token);
  //         console.log('Token saved to sessionStorage:', response.token);

  //         this.router.navigateByUrl('home');
  //       },
  //       error: (error) => {
  //         console.error('Login failed', error);
  //         // Handle error, show message to user, etc.
  //         this.apiError = error.error?.message;
  //       },
  //     });
  //   }
  // }

  onSubmit(registerForm: any) {
    if (registerForm.valid) {
      this.isLoading = true;
      this.loginservice.Login(this.model).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          // Navigate to home page after successful login
          this.loginservice.setLogin(response.token);
          console.log('Token saved to sessionStorage:', response.token);

          this.router.navigateByUrl('home');
        },
        error: (error) => {
          console.error('Login failed', error);
          // Handle error, show message to user, etc.
          this.apiError = error.error?.message;
          this.isLoading = false;
        },
      });
    }
  }
  // externalLogin() {
  //   this.loginservice.externalLogin();

  // }

  renderGoogleSignInButton(): void {
    google.accounts.id.initialize({
      client_id:
        '748134783269-d8b8i4lht8h89k703o4tkrkmq0jfrm51.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
      locale: 'en',
    });

    google.accounts.id.renderButton(
      document.getElementById('googleSignInDiv'),
      { theme: 'outline', size: 'large' }
    );

    google.accounts.id.prompt(); // show popup if needed
  }

  handleCredentialResponse(response: any) {
    const idToken = response.credential;
    this.loginservice.externalLogin(idToken).subscribe({
      next: (res) => {
        this.loginservice.setLogin(res.token);
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        console.error('Google login failed', err);
        this.apiError = 'Google login failed';
      },
    });
  }
}
