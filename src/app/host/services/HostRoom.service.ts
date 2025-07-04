import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HostRoomDto } from "../../core/models/room-details.model";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";

@Injectable({ providedIn: 'root' })
export class HostRoomService {
  private baseUrl = 'https://localhost:7188/api/HostRooms';
  constructor(private http: HttpClient) {}

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


getRoomsByListingId( listingId: number, page: number, pageSize: number, searchTerm: string = ''): Observable<{ rooms: HostRoomDto[], totalCount: number }> {
  const headers = this.getAuthHeaders();
  const hostId = this.getHostIdFromToken();
  const params = {
    page: page.toString(),
    pageSize: pageSize.toString(),
    search: searchTerm
  };
  return this.http.get<{ rooms: HostRoomDto[], totalCount: number }>(
    `${this.baseUrl}/listing/${listingId}?hostId=${hostId}`,
    { headers, params }
  );
}


  getRoom(roomId: number): Observable<HostRoomDto> {
    const hostId = this.getHostIdFromToken();
    return this.http.get<HostRoomDto>(`${this.baseUrl}/${roomId}?hostId=${hostId}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateRoom(roomId: number, data: any): Observable<void> {
    const hostId = this.getHostIdFromToken();
    return this.http.put<void>(`${this.baseUrl}/${roomId}?hostId=${hostId}`, data, {
      headers: this.getAuthHeaders()
    });
    
  }

  deleteRoom(roomId: number): Observable<void> {
    const hostId = this.getHostIdFromToken();
    return this.http.delete<void>(`${this.baseUrl}/${roomId}?hostId=${hostId}`, {
      headers: this.getAuthHeaders()
    });
  }
}
