import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListingSummary } from '../../../core/models/listing.model';
import { ToggleFavoriteResponse } from '../../../core/models/favorite.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
// private apiUrl = `${environment.apiurlauth}/favorites`;
private apiUrl = `${environment.apiurlfavorites}`;
  
  // نستخدم BehaviorSubject لتخزين قائمة IDs المفضلة محلياً
  // هذا يسمح لكل المكونات بمعرفة أي الوحدات في المفضلة بشكل لحظي
  private favoriteIdsSubject = new BehaviorSubject<Set<number>>(new Set());
  public favoriteIds$ = this.favoriteIdsSubject.asObservable();

  constructor(private http: HttpClient) {
    // عند تحميل الخدمة لأول مرة، قم بجلب قائمة المفضلة من الـ API
    this.loadUserFavorites();
  }

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

  /**
   * يجلب قائمة الوحدات المفضلة للمستخدم الحالي.
   * يتصل بـ: GET /api/favorites
   */
  getUserFavorites(): Observable<ListingSummary[]> {
    const userId = this.getHostIdFromToken();
    return this.http.get<ListingSummary[]>(`${this.apiUrl}?userId=${userId}`, {headers: this.getAuthHeaders()});
  }

  /**
   * يقوم بإضافة أو حذف وحدة من المفضلة.
   * يتصل بـ: POST /api/favorites/toggle/{listingId}
   */
  toggleFavorite(listingId: number): Observable<ToggleFavoriteResponse> {
    const userId = this.getHostIdFromToken();
    return this.http.post<ToggleFavoriteResponse>(`${this.apiUrl}/toggle/${listingId}?userId=${userId}`, {headers: this.getAuthHeaders()}).pipe(
      // بعد نجاح الطلب، نقوم بتحديث الحالة المحلية
      tap(response => {
        const currentIds = this.favoriteIdsSubject.getValue();
        if (response.isFavorite) {
          currentIds.add(listingId);
        } else {
          currentIds.delete(listingId);
        }
        this.favoriteIdsSubject.next(currentIds);
      })
    );
  }

  /**
   * دالة خاصة لتحميل المفضلة وتحديث الـ BehaviorSubject
   */
  private loadUserFavorites(): void {
    this.getUserFavorites().subscribe(favorites => {
      const ids = new Set(favorites.map(f => f.id));
      this.favoriteIdsSubject.next(ids);
    });
  }
}
