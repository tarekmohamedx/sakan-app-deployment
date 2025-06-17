import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookingRequestDto, ListingDetailsDto } from '../../../core/models/listing-details.model';
import { Observable } from 'rxjs';

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
    `${this.baseUrl}/ListingDetails/request`,
    dto // ✅ plain object, no wrapping
  );
}
// getListing(id: number) {
//   const lang = localStorage.getItem('lang') || 'en';
//   return this.http.get(`/api/listings/${id}?lang=${lang}`);
// }





  getCurrentUserId(): string {
    return 'bdb1afd1-897a-46ef-8773-ff28354135b5'; // Replace with real auth logic
  }

}
