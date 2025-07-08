import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

private apiUrl =` ${environment.apiurlpayments}`;

  constructor(private http: HttpClient) { }

  createPaymentIntent(bookingId: number): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(`${this.apiUrl}/create-intent`, { bookingId });
  }
}
