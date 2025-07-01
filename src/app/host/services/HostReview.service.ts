import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { HostBooking } from '../../core/models/HostBooking';
import { UserReview } from '../../core/models/HostReview';

interface MyJwtPayload {
  nameid: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class HostReviewService {
  private apiUrl = 'https://localhost:7188/api/HostReviews';

  constructor(private http: HttpClient) {}

  // Decode hostId (userId) from JWT in session storage
    private getHostIdFromToken(): string | null {
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


    private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
        Authorization: `Bearer ${token}`
    });
    }

    getUserReviews(): Observable<UserReview[]> {
        const hostId = this.getHostIdFromToken();
        return this.http.get<UserReview[]>(`${this.apiUrl}/host-reviews?hostId=${hostId}`, {
            headers: this.getAuthHeaders()
        });
    }

    submitReview(dto: { bookingId: number; rating: number; comment: string }): Observable<void> {
        const hostId = this.getHostIdFromToken();
        return this.http.post<void>(`${this.apiUrl}/review-user?hostId=${hostId}`, dto, {
            headers: this.getAuthHeaders()
        });
    }


    getmyReviews(): Observable<UserReview[]> {
        const hostId = this.getHostIdFromToken();
        return this.http.get<UserReview[]>(`${this.apiUrl}/my-reviews?hostId=${hostId}`, {
            headers: this.getAuthHeaders()
        });
    }

    createReview(dto: { bookingId: number; rating: number; comment: string }): Observable<void> {
        const hostId = this.getHostIdFromToken();
        return this.http.post<void>(`${this.apiUrl}/create-review?hostId=${hostId}`, dto, {
            headers: this.getAuthHeaders()
        });
    }

}
