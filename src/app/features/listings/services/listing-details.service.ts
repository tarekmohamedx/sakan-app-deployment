import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookingRequestDto, ListingDetailsDto } from '../../../core/models/listing-details.model';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class ListingDetailsService {
  private baseUrl = 'https://localhost:7188/api'; // adjust if different

  constructor(private http: HttpClient) {}

  getListingDetails(id: number): Observable<ListingDetailsDto> {
    // const lang = localStorage.getItem('lang') || 'en';
    return this.http.get<ListingDetailsDto>(`${this.baseUrl}/ListingDetails/${id}`);
  }

  getBookedMonths(listingId: number): Observable<{ year: number, month: number }[]> {
    // const lang = localStorage.getItem('lang') || 'en';
    return this.http.get<{ year: number, month: number }[]>(`${this.baseUrl}/booked-months/${listingId}`);
  }

  createRequest(dto: BookingRequestDto): Observable<{ requestId: number, hostId: string }> {
    return this.http.post<{ requestId: number, hostId: string }>(
      `${this.baseUrl}/ListingDetails/request`,dto 
    );
  } 

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

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  private getCurrentUserName(): string | null {
  const token = sessionStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<any>(token);
    const hostId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    return hostId || null;
  } catch (error) {
    console.error("❌ Failed to decode JWT", error);
    return null;
  }
}


approveGuest(bookingId: number): Observable<void> {
  const guestId = this.getCurrentUserId();
  return this.http.post<void>(
    `${this.baseUrl}/ListingDetails/${bookingId}/approve-guest`,
    { guestId }, // ✅ send as request body
    { headers: this.getAuthHeaders() } // ✅ send headers separately
  );
}

approveHost(bookingId: number): Observable<void> {
  const hostId = this.getCurrentUserId();
  return this.http.post<void>(
    `${this.baseUrl}/ListingDetails/${bookingId}/approve-host`,
    { hostId }, // ✅ send as request body
    { headers: this.getAuthHeaders() }
  );
}



}
