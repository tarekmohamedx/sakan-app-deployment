import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
// import { Modal } from 'bootstrap';

@Component({
  selector: 'app-become-host',
  standalone: true,
  imports: [],
  templateUrl: './become-host.component.html',
  styleUrl: './become-host.component.css'
})
export class BecomeHostComponent {
  constructor(private http: HttpClient, private router: Router,) {}

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
  
  getCurrentUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = jwtDecode(token) as { [key: string]: any };
    const userId =
      decoded[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];

    return userId;
  }

confirmBecomeHost() {
  const userId = this.getCurrentUserId();
  if (!userId) {
    Swal.fire('Error', 'User not authenticated.', 'error');
    return;
  }

  this.http.post('https://localhost:7188/api/users/become-host', { userId }).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Request Submitted',
        text: 'Please wait for admin approval.',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        window.location.href = '/home'; 
      });
    },
    error: err => {
      console.error('Host request failed', err);
      Swal.fire('Error', 'Something went wrong.', 'error');
    }
  });
}

closePopup() {
  this.router.navigate(['/home']);
}


}
