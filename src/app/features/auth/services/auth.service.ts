import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../../../core/models/register';
import { Observable } from 'rxjs';
import { env } from 'process';
import { environment } from '../../../environments/environment';
import { Login } from '../../../core/models/Login';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Jwtpayloadd } from '../../../core/models/Jwtpayload';
import { Route } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(this.getuserdata());
  private authsubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public currentUser$ = this.currentUserSubject.asObservable();
  constructor(private readonly httpclient: HttpClient, private route: Router) {}

  // generation register & Login services

  Register(register: Register): Observable<any> {
    return this.httpclient.post<any>(
      `${environment.apiurlauth}/register`,
      register
    );
  }
  initiateGoogleLogin() {
    // Store current route for redirect back after login
    localStorage.setItem('preAuthRoute', window.location.pathname);

    // Redirect to Google auth endpoint
    window.location.href = `${environment.googleAuthUrl}?returnUrl=${environment.googleCallbackUrl}`;
  }

  getauthsubject(): BehaviorSubject<boolean> {
    return this.authsubject;
  }

  handleGoogleCallback() {
    // This would be called after returning from Google
    const returnUrl = localStorage.getItem('preAuthRoute') || '/';
    localStorage.removeItem('preAuthRoute');
    return returnUrl;
  }
  Login(login: Login): Observable<any> {
    return this.httpclient.post<any>(`${environment.apiurlauth}/Login`, login);
  }
  externalLogin() {
    // This backend endpoint should initiate Google login (e.g. /signin-google)
    window.location.href = `${environment.apiurlauth}/externallogin/google`;
  }

  // islogging
  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) return false;

    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    // Check if the token is expired
    return decoded.exp ? decoded.exp > currentTime : true;
  }
  notifyLogin() {
    const user = this.getuserdata();
    this.currentUserSubject.next(user);
  }
  logout(): void {
    sessionStorage.removeItem('token');
    //this.user = null;
    this.currentUserSubject.next(null); // Notify logout
    this.authsubject.next(false); // Notify login status

    this.route.navigateByUrl('/home');
  }
  getuserdata(): {
    name: string;
    email: string;
    id: string;
    role: string;
  } | null {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      return {
        name: decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ],
        email:
          decoded[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
          ],
        id: decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ],
        role: decoded[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ],
      };
    }
    return null;
  }

  //jwt
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = jwtDecode(token) as { [key: string]: any };
    const userId =
      decoded[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];

    return userId;
  }

  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = jwtDecode(token) as { [key: string]: any };
    const role =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    return role;
  }
}
