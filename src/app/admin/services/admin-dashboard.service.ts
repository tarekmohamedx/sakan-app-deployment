import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityLogDto, DashboardSummaryDto } from '../../core/models/admin-dashboard';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private apiUrl = 'https://localhost:7188/api/admin/dashboard';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummaryDto> {
    return this.http.get<DashboardSummaryDto>(`${this.apiUrl}/summary`);
  }

  getRecentActivity(): Observable<ActivityLogDto[]> {
    return this.http.get<ActivityLogDto[]>(`${this.apiUrl}/activity`);
  }
}
