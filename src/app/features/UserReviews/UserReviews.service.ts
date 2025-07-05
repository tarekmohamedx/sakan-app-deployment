import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UserReview, ReviewDto } from '../../core/models/HostReview';
import { BookingReview } from '../../core/models/user-reviews';

@Injectable({
  providedIn: 'root'
})
export class UserReviewsService {
  private apiUrl = 'https://localhost:7188/api/UserReviews';

  constructor(private http: HttpClient) {}

   getCurrentUserId(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode<any>(token);
      return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
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

  // ✅ Submit a review (for host or listing)
  submitReview(dto: UserReview): Observable<void> {
    const userId = this.getCurrentUserId();
    return this.http.post<void>(`${this.apiUrl}/create?userId=${userId}`, dto, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get reviews for a listing
  getListingReviews(listingId: number): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${this.apiUrl}/listing/${listingId}`);
  }

  // ✅ Get reviews for a host
  getHostReviews(hostId?: string): Observable<ReviewDto[]> {
    const id = hostId || this.getCurrentUserId();
    if (!id) throw new Error("Host ID not found.");
    return this.http.get<ReviewDto[]>(`${this.apiUrl}/host/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get bookings for the currently logged-in user (to allow them to rate)
  getUserBookings(): Observable<BookingReview[]> {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error("User ID not found.");
    return this.http.get<BookingReview[]>(`${this.apiUrl}/user-bookings/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }
}
