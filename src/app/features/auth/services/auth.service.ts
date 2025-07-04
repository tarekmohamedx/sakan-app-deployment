import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../../../core/models/register';
import { BehaviorSubject, Observable } from 'rxjs';
import { env } from 'process';
import { environment } from '../../../environments/environment';
import { Login } from '../../../core/models/Login';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Jwtpayloadd } from '../../../core/models/Jwtpayload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly httpclient: HttpClient) {}
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

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

  // Call this after login success

  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }

  setLogin(token: string): void {
    sessionStorage.setItem('token', token);
    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  checkLogin(): void {
    this.isLoggedInSubject.next(this.hasToken());
  }
}
