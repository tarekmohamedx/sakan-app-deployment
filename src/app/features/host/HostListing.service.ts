import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HostListingService {
  private apiUrl = 'https://localhost:7188/api/HostListings';

  constructor(private http: HttpClient) {}

  // Get all listings for the current host
  getMyListings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my`);
  }

  // Get a specific listing by ID (for edit)
  getListingById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Update a listing
  updateListing(id: number, data: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  // Delete a listing
  deleteListing(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
