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
    const lang = localStorage.getItem('lang') || 'en';
    return this.http.get<ListingDetailsDto>(`${this.baseUrl}/ListingDetails/${id}?lang=${lang}`);
  }

  getBookedMonths(listingId: number): Observable<{ year: number, month: number }[]> {
    const lang = localStorage.getItem('lang') || 'en';
    return this.http.get<{ year: number, month: number }[]>(`${this.baseUrl}/booked-months/${listingId}?lang=${lang}`);
  }

  createRequest(dto: BookingRequestDto): Observable<{ requestId: number, hostId: string }> {
    return this.http.post<{ requestId: number, hostId: string }>(
      `${this.baseUrl}/ListingDetails/request`,dto 
    );
  }

  // getCurrentUserId(): string {
  //   return 'bdb1afd1-897a-46ef-8773-ff28354135b5'; // Replace with real auth logic
  // }
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

//   getCurrentUserName(): string {
//   const token = sessionStorage.getItem('token'); // or localStorage
//   if (!token) return '';

//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.name || ''; // or 'unique_name' based on your claim structure
//   } catch {
//     return '';
//   }
// }
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  //   getListingById(id: number): Observable<any> {
  //   const hostId = this.getHostIdFromToken();
  //   return this.http.get<any>(`${this.apiUrl}/${id}?hostId=${hostId}`, {
  //     headers: this.getAuthHeaders()
  //   });
  // }

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
