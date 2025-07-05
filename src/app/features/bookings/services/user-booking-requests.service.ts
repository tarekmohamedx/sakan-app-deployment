import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserBookingRequest {
  guestId: string;
  hostId: string;
  bookingRequestId: number;
  listingTitle: string;
  bedPrice: number | null;
  listingLocation: string;
  fromDate: string;
  toDate: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class UserBookingRequestsService {
  private apiUrl = 'https://localhost:7188/api/BookingRequest';

  constructor(private http: HttpClient) {}

  private getUserId(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
    } catch {
      return null;
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getUserBookingRequests(): Observable<UserBookingRequest[]> {
    const userId = this.getUserId();
    return this.http.get<UserBookingRequest[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }
}
