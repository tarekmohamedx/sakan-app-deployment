import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../models/register';
import { Observable } from 'rxjs';
import { env } from 'process';
import { environment } from '../../environments/environment';
import { Login } from '../models/Login';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Jwtpayloadd } from '../models/Jwtpayload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly httpclient: HttpClient) {}

  // generation register & Login services

  Register(register: Register): Observable<any> {
    return this.httpclient.post<any>(
      `${environment.apiurlauth}/register`,
      register
    );
  }
  Login(login: Login): Observable<any> {
    return this.httpclient.post<any>(`${environment.apiurlauth}/Login`, login);
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
}
