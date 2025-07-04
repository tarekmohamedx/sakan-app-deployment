import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminListingService {
    private baseUrl = 'https://localhost:7188/api/admin';

    constructor(private http: HttpClient) {}

    getPendingListings(page: number, pageSize: number, search: string = '') {
        return this.http.get<{ items: any[], totalCount: number }>(
         `${this.baseUrl}/not-approved-listings?pageNumber=${page}&pageSize=${pageSize}&search=${search}`

        );
      }
      approveListing(id: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/approve/${id}`, null);
      }

  rejectListing(id: number) {
    return this.http.delete(`${this.baseUrl}/reject/${id}`);
  }
}