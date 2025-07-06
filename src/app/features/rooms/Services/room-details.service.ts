import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoomDetailsDto } from '../../../core/models/room-details.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoomDetailsService {
  private baseUrl = 'https://localhost:7188/api'; // adjust if different

  constructor(private http: HttpClient) {}

    getRoomDetails(id: number): Observable<RoomDetailsDto> {
        const lang = localStorage.getItem('lang') || 'en';
        return this.http.get<RoomDetailsDto>(`${this.baseUrl}/Room/${id}?lang=${lang}`);
    }

    getBookedMonths(roomId: number): Observable<{ year: number; month: number }[]> {
        const lang = localStorage.getItem('lang') || 'en';
        return this.http.get<{ year: number; month: number }[]>(`${this.baseUrl}/ListingDetails/booked-months/${roomId}?lang=${lang}`);
    }
//     getBookedMonths(listingId: number): Observable<{ year: number, month: number }[]> {
//     return this.http.get<{ year: number, month: number }[]>(`${this.baseUrl}/booked-months/${listingId}`);
//   }
}
