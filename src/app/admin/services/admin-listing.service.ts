import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityLogDto, DashboardSummaryDto } from '../../core/models/admin-dashboard';

@Injectable({
  providedIn: 'root'
})
export class adminListingService {
  private apiUrl = 'https://localhost:7188/api/admin/list';

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

  // ApproveListing(id: number): Observable<void> {
  //   return this.http.post<void>(`${this.apiUrl}/${id}/approve`, {});
  // }

  // RejectListing(id: number): Observable<void> {
  //   return this.http.post<void>(`${this.apiUrl}/${id}/reject`, {});
  // }

}