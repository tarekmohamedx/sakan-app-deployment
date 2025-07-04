import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityLogDto, DashboardSummaryDto } from '../../core/models/admin-dashboard';

@Injectable({
    providedIn: 'root'
})
export class adminListingService {
  private apiUrl = 'https://localhost:7188/api/admin/list';
  private adminApproveUrl = 'https://localhost:7188/api/adminapprove';

  constructor(private http: HttpClient) {}

  getAllListings(page: number, pageSize: number, searchTerm: string = ''): Observable<any> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      search: searchTerm
    };

    return this.http.get<{ listings: any[], totalCount: number }>(
      `${this.apiUrl}/all`,
      { params }
    );
  }

  updateListing(id: number, data: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  deleteListing(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

    getListingById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getPendingListings(page: number, pageSize: number, search: string = '') {
    return this.http.get<{ items: any[], totalCount: number }>(
     `${this.adminApproveUrl}/not-approved-listings?pageNumber=${page}&pageSize=${pageSize}&search=${search}`

    );
  }
  approveListing(id: number): Observable<any> {
    return this.http.post(`${this.adminApproveUrl}/approve/${id}`, null);
  }

rejectListing(id: number) {
return this.http.delete(`${this.adminApproveUrl}/reject/${id}`);
}
}